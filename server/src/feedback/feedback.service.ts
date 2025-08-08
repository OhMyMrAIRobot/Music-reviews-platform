import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Feedback, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackRepliesService } from 'src/feedback-replies/feedback-replies.service';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { CreateFeedbackRequestDto } from './dto/request/create-feedback.request.dto';
import { FindFeedbackQuery } from './dto/request/query/find-feedback.query.dto';
import { UpdateFeedbackRequestDto } from './dto/request/update-feedback.request.dto';
import {
  FeedbackResponseItem,
  FindFeedbackResponseDto,
} from './dto/response/find-feedback.response.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(forwardRef(() => FeedbackRepliesService))
    private readonly feedbackResponsesService: FeedbackRepliesService,
    private readonly prisma: PrismaService,
    private readonly statusesService: FeedbackStatusesService,
  ) {}

  async create(dto: CreateFeedbackRequestDto): Promise<Feedback> {
    const status = await this.statusesService.findByStatus(
      FeedbackStatusesEnum.NEW,
    );

    if (!status) {
      throw new EntityNotFoundException(
        'Статус отзыва',
        'названием',
        `${FeedbackStatusesEnum.NEW}`,
      );
    }

    return this.prisma.feedback.create({
      data: { ...dto, feedbackStatusId: status.id },
    });
  }

  async findAll(query: FindFeedbackQuery): Promise<FindFeedbackResponseDto> {
    const { limit, offset, order, query: searchTerm, statusId } = query;

    if (statusId) {
      await this.statusesService.findOne(statusId);
    }

    const where: Prisma.FeedbackWhereInput = {};

    if (statusId) {
      where.feedbackStatusId = statusId;
    }

    if (searchTerm) {
      where.OR = [
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { message: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [count, feedback] = await Promise.all([
      this.prisma.feedback.count({ where }),
      this.prisma.feedback.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ createdAt: order || 'desc' }, { id: 'desc' }],
        include: {
          feedbackStatus: true,
        },
      }),
    ]);

    return {
      count,
      feedback: plainToInstance(FeedbackResponseItem, feedback, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async findById(id: string): Promise<Feedback> {
    const existing = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new EntityNotFoundException('Отзыв', 'id', `${id}`);
    }

    return existing;
  }

  async update(
    id: string,
    dto: UpdateFeedbackRequestDto,
  ): Promise<FeedbackResponseItem> {
    await this.findById(id);
    const status = await this.statusesService.findOne(dto.feedbackStatusId);

    if (
      (status.status as FeedbackStatusesEnum) === FeedbackStatusesEnum.ANSWERED
    ) {
      const response = await this.feedbackResponsesService.findByFeedbackId(id);

      if (!response) {
        throw new ConflictException(
          'Данный статус не может быть установлен без отправки сообщения!',
        );
      }
    }

    const updated = await this.prisma.feedback.update({
      where: { id },
      data: dto,
      include: {
        feedbackStatus: true,
      },
    });

    return plainToInstance(FeedbackResponseItem, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<Feedback> {
    await this.findById(id);
    return this.prisma.feedback.delete({
      where: { id },
    });
  }
}
