import { Injectable } from '@nestjs/common';
import { Feedback, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackQueryDto } from './dto/feedback-query.dto';
import {
  FeedbackResponseItem,
  FeedbacksResponseDto,
} from './dto/feedbacks.response.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusesService: FeedbackStatusesService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
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
      data: { ...createFeedbackDto, feedbackStatusId: status.id },
    });
  }

  async findAll(query: FeedbackQueryDto): Promise<FeedbacksResponseDto> {
    const {
      limit = 10,
      offset = 0,
      order,
      query: searchTerm,
      statusId,
    } = query;

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

    const [count, feedbacks] = await Promise.all([
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
      feedbacks: plainToInstance(FeedbackResponseItem, feedbacks, {
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
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<FeedbackResponseItem> {
    await this.findById(id);
    await this.statusesService.findOne(updateFeedbackDto.feedbackStatusId);

    const updated = await this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
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
