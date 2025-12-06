import { Injectable } from '@nestjs/common';
import { ReleaseType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all release types available in the system.
   *
   * This method performs a simple read from the `releaseType` table and
   * returns an array of `ReleaseType` records. It does not apply any
   * filtering or pagination.
   *
   * @returns Promise<ReleaseType[]> - list of all release types.
   */
  async findAll(): Promise<ReleaseType[]> {
    return this.prisma.releaseType.findMany();
  }

  /**
   * Returns a single release type by its id.
   *
   * Throws `EntityNotFoundException` when no matching release type
   * is found for the provided `id`.
   *
   * @param id - UUID / entity id of the release type to retrieve.
   * @returns Promise<ReleaseType> - the found release type.
   * @throws EntityNotFoundException when the entity does not exist.
   */
  async findOne(id: string): Promise<ReleaseType> {
    const existingType = await this.prisma.releaseType.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new EntityNotFoundException('Тип релиза', 'id', `${id}`);
    }

    return existingType;
  }

  /**
   * Find a release type by its human-readable `type` string.
   *
   * This performs a case-insensitive search for the first matching
   * `releaseType` record with the provided `type` value. Returns `null`
   * when none was found.
   *
   * @param type - human-readable release type string.
   * @returns Promise<ReleaseType | null>
   */
  async findByType(type: string): Promise<ReleaseType | null> {
    return this.prisma.releaseType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
