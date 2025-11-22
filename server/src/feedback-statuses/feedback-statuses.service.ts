import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class FeedbackStatusesService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Returns all available feedback statuses defined in the system.
   *
   * This performs a simple `findMany` on `feedbackStatus` and is used
   * to populate admin interfaces and server-side validations.
   *
   * @returns Promise<FeedbackStatus[]> - array of feedback statuses
   */
  async findAll(): Promise<FeedbackStatus[]> {
    return this.prisma.feedbackStatus.findMany();
  }

  /**
   * Returns a single feedback status by id.
   *
   * Throws `EntityNotFoundException` when the provided id does not
   * match an existing feedback status.
   *
   * @param id - entity id of the feedback status
   * @returns Promise<FeedbackStatus>
   * @throws EntityNotFoundException when not found
   */
  async findOne(id: string) {
    const existingStatus = await this.prisma.feedbackStatus.findUnique({
      where: { id },
    });

    if (!existingStatus) {
      throw new EntityNotFoundException('Статус отзыва', 'id', `${id}`);
    }

    return existingStatus;
  }

  /**
   * Finds a feedback status by its human-readable `status` string.
   * The search is case-insensitive and returns `null` when no match is
   * found.
   *
   * @param status - human-readable status
   * @returns Promise<FeedbackStatus | null>
   */
  async findByStatus(status: string): Promise<FeedbackStatus | null> {
    return this.prisma.feedbackStatus.findFirst({
      where: { status: { equals: status, mode: 'insensitive' } },
    });
  }
}
