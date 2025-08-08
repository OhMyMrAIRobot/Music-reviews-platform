import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class FeedbackStatusesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findByStatus(status: string): Promise<FeedbackStatus | null> {
    return this.prisma.feedbackStatus.findFirst({
      where: { status: { equals: status, mode: 'insensitive' } },
    });
  }
}
