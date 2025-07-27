import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FeedbackResponse } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { FeedbackService } from 'src/feedback/feedback.service';
import { MailsService } from 'src/mails/mails.service';
import { UsersService } from 'src/users/users.service';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';

@Injectable()
export class FeedbackResponsesService {
  constructor(
    @Inject(forwardRef(() => FeedbackService))
    private readonly feedbackService: FeedbackService,
    private readonly prisma: PrismaService,
    private readonly feedbackStatusesService: FeedbackStatusesService,
    private readonly usersService: UsersService,
    private readonly mailsService: MailsService,
  ) {}

  async create(
    createFeedbackResponseDto: CreateFeedbackResponseDto,
    userId: string,
  ) {
    const feedback = await this.feedbackService.findById(
      createFeedbackResponseDto.feedbackId,
    );

    const exist = await this.findByFeedbackId(
      createFeedbackResponseDto.feedbackId,
    );

    if (exist) {
      throw new ConflictException('Ответ на данное сообщение уже существует');
    }

    const user = await this.usersService.findOne(userId);

    let isSent = false;
    try {
      await this.mailsService.sendResponseEmail(
        feedback.email,
        user.nickname,
        createFeedbackResponseDto.message,
      );
      isSent = true;
    } catch {
      isSent = false;
    }

    let feedbackResponse: FeedbackResponse | null = null;
    try {
      if (isSent) {
        feedbackResponse = await this.prisma.feedbackResponse.create({
          data: {
            ...createFeedbackResponseDto,
            userId,
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

        await this.feedbackService.update(
          createFeedbackResponseDto.feedbackId,
          {
            feedbackStatusId: newStatus.id,
          },
        );
      }
    } catch {
      feedbackResponse = null;
    }

    return { isSent, feedbackResponse };
  }

  async findByFeedbackId(feedbackId: string): Promise<FeedbackResponse | null> {
    await this.feedbackService.findById(feedbackId);

    return this.prisma.feedbackResponse.findUnique({
      where: { feedbackId },
    });
  }
}
