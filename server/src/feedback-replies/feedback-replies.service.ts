import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FeedbackResponse, FeedbackStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { FeedbackService } from 'src/feedback/feedback.service';
import { MailsService } from 'src/mails/mails.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { CreateFeedbackReplyRequestDto } from './dto/request/create-feedback-reply.request.dto';
import { CreateFeedbackReplyResponseDto } from './dto/response/create-feedback-reply.response.dto';
import { FeedbackReplyResponseDto } from './dto/response/feedback-reply.response.dto';

@Injectable()
export class FeedbackRepliesService {
  constructor(
    @Inject(forwardRef(() => FeedbackService))
    private readonly feedbackService: FeedbackService,
    private readonly prisma: PrismaService,
    private readonly feedbackStatusesService: FeedbackStatusesService,
    private readonly usersService: UsersService,
    private readonly mailsService: MailsService,
  ) {}

  async create(
    dto: CreateFeedbackReplyRequestDto,
    userId: string,
  ): Promise<CreateFeedbackReplyResponseDto> {
    const feedback = await this.feedbackService.findById(dto.feedbackId);

    const exist = await this.findByFeedbackId(dto.feedbackId);

    if (exist) {
      throw new ConflictException('Ответ на данное сообщение уже существует');
    }

    const user = await this.usersService.findOne(userId);

    let isSent = false;
    try {
      await this.mailsService.sendResponseEmail(
        feedback.email,
        user.nickname,
        dto.message,
      );
      isSent = true;
    } catch {
      isSent = false;
    }

    let feedbackReply: FeedbackResponse | null = null;
    let feedbackStatus: FeedbackStatus | null = null;
    try {
      if (isSent) {
        feedbackReply = await this.prisma.feedbackResponse.create({
          data: {
            ...dto,
            userId,
          },
          include: {
            user: { select: { nickname: true } },
          },
        });

        const newStatus = await this.feedbackStatusesService.findByStatus(
          FeedbackStatusesEnum.ANSWERED,
        );

        if (!newStatus) {
          throw new EntityNotFoundException(
            'Статус сообщения',
            'названием',
            FeedbackStatusesEnum.ANSWERED,
          );
        }

        const updated = await this.feedbackService.update(dto.feedbackId, {
          feedbackStatusId: newStatus.id,
        });
        feedbackStatus = updated.feedbackStatus;
      }
    } catch {
      feedbackReply = null;
      feedbackStatus = null;
    }

    return plainToInstance(
      CreateFeedbackReplyResponseDto,
      {
        isSent,
        feedbackReply,
        feedbackStatus,
      },
      { excludeExtraneousValues: true },
    );
  }

  async findByFeedbackId(
    feedbackId: string,
  ): Promise<FeedbackReplyResponseDto | null> {
    await this.feedbackService.findById(feedbackId);

    const response = await this.prisma.feedbackResponse.findUnique({
      where: { feedbackId },
      include: {
        user: { select: { nickname: true } },
      },
    });

    return plainToInstance(FeedbackReplyResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }
}
