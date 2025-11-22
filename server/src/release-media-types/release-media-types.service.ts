import { Injectable } from '@nestjs/common';
import { ReleaseMediaType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseMediaTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all available release media types.
   *
   * This is a simple read operation that fetches all rows from
   * `releaseMediaType`. It is intended for populating client-side
   * pickers and server-side comparisons.
   *
   * @returns Promise<ReleaseMediaType[]> - list of media type records.
   */
  async findAll(): Promise<ReleaseMediaType[]> {
    return this.prisma.releaseMediaType.findMany();
  }

  /**
   * Returns a single media type identified by `id`.
   *
   * Throws `EntityNotFoundException` if the given id does not point to an
   * existing media type.
   *
   * @param id - entity id of the media type
   * @returns Promise<ReleaseMediaType> - the found media type record
   * @throws EntityNotFoundException when no record matches the id
   */
  async findById(id: string): Promise<ReleaseMediaType> {
    const type = await this.prisma.releaseMediaType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new EntityNotFoundException('Тип медиа', 'id', id);
    }

    return type;
  }

  /**
   * Finds a media type by its human-readable `type` string. The search
   * is case-insensitive and matches partial values.
   *
   * Returns the first matching record or throws `EntityNotFoundException`
   * if none is found.
   *
   * @param type - human-readable media type string
   * @returns Promise<ReleaseMediaType>
   * @throws EntityNotFoundException when no matching record exists
   */
  async findByType(type: string): Promise<ReleaseMediaType> {
    const exist = await this.prisma.releaseMediaType.findFirst({
      where: { type: { contains: type, mode: 'insensitive' } },
    });

    if (!exist) {
      throw new EntityNotFoundException('Тип медиа', 'названием', type);
    }

    return exist;
  }
}
