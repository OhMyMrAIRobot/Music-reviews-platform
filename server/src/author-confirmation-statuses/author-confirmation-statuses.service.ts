import { Injectable } from '@nestjs/common';
import { AuthorConfirmationStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class AuthorConfirmationStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all author confirmation statuses.
   *
   * This is a simple read operation used to populate admin UIs and for
   * server-side validation when updating or creating author records.
   *
   * @returns Promise<AuthorConfirmationStatus[]> - list of statuses
   */
  async findAll(): Promise<AuthorConfirmationStatus[]> {
    return this.prisma.authorConfirmationStatus.findMany();
  }

  /**
   * Returns a single author confirmation status by id.
   *
   * Throws `EntityNotFoundException` when the provided id does not match
   * any existing status record.
   *
   * @param id - status entity id
   * @returns Promise<AuthorConfirmationStatus>
   * @throws EntityNotFoundException when not found
   */
  async findOne(id: string): Promise<AuthorConfirmationStatus> {
    const status = await this.prisma.authorConfirmationStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new EntityNotFoundException(
        'Статус подтверждения автора',
        'id',
        id,
      );
    }

    return status;
  }

  /**
   * Find a confirmation status by its human-readable `status` string.
   * Search is case-insensitive.
   *
   * @param status - human-readable status string
   * @returns Promise<AuthorConfirmationStatus>
   * @throws EntityNotFoundException when not found
   */
  async findByStatus(status: string): Promise<AuthorConfirmationStatus> {
    const exist = await this.prisma.authorConfirmationStatus.findFirst({
      where: { status: { equals: status, mode: 'insensitive' } },
    });

    if (!exist) {
      throw new EntityNotFoundException(
        'Статус подтверждения автора',
        'названием',
        status,
      );
    }

    return exist;
  }
}
