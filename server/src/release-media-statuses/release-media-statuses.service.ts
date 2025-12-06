import { Injectable } from '@nestjs/common';
import { ReleaseMediaStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseMediaStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all available media statuses.
   *
   * This method is a straightforward read from `releaseMediaStatus` and
   * is used to supply client lists and server-side validation.
   *
   * @returns Promise<ReleaseMediaStatus[]> - list of all statuses
   */
  async findAll(): Promise<ReleaseMediaStatus[]> {
    return this.prisma.releaseMediaStatus.findMany();
  }

  /**
   * Returns a single media status by id.
   *
   * Throws `EntityNotFoundException` when the id does not match any
   * existing status.
   *
   * @param id - entity id of the media status
   * @returns Promise<ReleaseMediaStatus> - the found status
   * @throws EntityNotFoundException when the entity is not found
   */
  async findById(id: string): Promise<ReleaseMediaStatus> {
    const status = await this.prisma.releaseMediaStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new EntityNotFoundException('Статус медиа', 'id', id);
    }

    return status;
  }

  /**
   * Finds a media status by its human-readable `status` string. The
   * search is case-insensitive and supports partial matches.
   *
   * @param status - human-readable status string (partial allowed)
   * @returns Promise<ReleaseMediaStatus>
   * @throws EntityNotFoundException when no matching status exists
   */
  async findByStatus(status: string): Promise<ReleaseMediaStatus> {
    const exist = await this.prisma.releaseMediaStatus.findFirst({
      where: { status: { contains: status, mode: 'insensitive' } },
    });

    if (!exist) {
      throw new EntityNotFoundException('Статус медиа', 'названием', status);
    }

    return exist;
  }
}
