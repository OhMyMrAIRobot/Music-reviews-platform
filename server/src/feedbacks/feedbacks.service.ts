import { Injectable } from '@nestjs/common';
import { Feedback } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusesService: FeedbackStatusesService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const status = await this.statusesService.findByStatus(
      FeedbackStatusesEnum.New,
    );

    if (!status) {
      throw new EntityNotFoundException(
        'Статус отзыва',
        'названием',
        `${FeedbackStatusesEnum.New}`,
      );
    }

    return this.prisma.feedback.create({
      data: { ...createFeedbackDto, feedbackStatusId: status.id },
    });
  }

  async findAll(): Promise<Feedback[]> {
    return this.prisma.feedback.findMany();
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

  async findByStatusId(feedbackStatusId: string): Promise<Feedback[]> {
    const existing = await this.prisma.feedback.findMany({
      where: { feedbackStatusId },
    });

    if (existing.length === 0) {
      throw new EntityNotFoundException(
        'Отзыв',
        'status id',
        `${feedbackStatusId}`,
      );
    }

    return existing;
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    await this.findById(id);
    await this.statusesService.findOne(updateFeedbackDto.feedbackStatusId);

    return this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });
  }

  async remove(id: string): Promise<Feedback> {
    await this.findById(id);
    return this.prisma.feedback.delete({
      where: { id },
    });
  }
}
