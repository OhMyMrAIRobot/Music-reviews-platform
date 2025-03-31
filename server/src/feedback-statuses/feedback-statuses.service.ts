import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { CreateFeedbackStatusDto } from './dto/create-feedback-status.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';

@Injectable()
export class FeedbackStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createFeedbackStatusDto: CreateFeedbackStatusDto,
  ): Promise<FeedbackStatus> {
    const { status } = createFeedbackStatusDto;
    const existingStatus = await this.findByStatus(status);

    if (existingStatus) {
      throw new DuplicateFieldException(
        'Статус отзыва',
        'названием',
        `${status}`,
      );
    }

    return this.prisma.feedbackStatus.create({
      data: createFeedbackStatusDto,
    });
  }

  async findAll(): Promise<FeedbackStatus[]> {
    return this.prisma.feedbackStatus.findMany();
  }

  async findOne(id: string) {
    const existingStatus = await this.prisma.feedbackStatus.findUnique({
      where: { id },
    });

    if (!existingStatus) {
      throw new EntityNotFoundException('Статус отзыва', 'id', `${id}`);
    }

    return existingStatus;
  }

  async update(id: string, updateFeedbackStatusDto: UpdateFeedbackStatusDto) {
    if (
      !updateFeedbackStatusDto ||
      Object.keys(updateFeedbackStatusDto).length === 0
    ) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);

    const { status } = updateFeedbackStatusDto;
    if (status) {
      const existingStatus = await this.findByStatus(status);
      if (existingStatus) {
        throw new DuplicateFieldException(
          'Статус отзыва',
          'названием',
          `${existingStatus.status}`,
        );
      }
    }

    return this.prisma.feedbackStatus.update({
      where: { id },
      data: updateFeedbackStatusDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.feedbackStatus.delete({
      where: { id },
    });
  }

  private async findByStatus(status: string): Promise<FeedbackStatus | null> {
    return this.prisma.feedbackStatus.findFirst({
      where: { status: { equals: status, mode: 'insensitive' } },
    });
  }
}
