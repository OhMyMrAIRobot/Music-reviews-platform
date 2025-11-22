import { Injectable } from '@nestjs/common';
import { AuthorType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class AuthorTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all available author types.
   *
   * This is a simple read operation used to populate pickers and to
   * validate author assignments.
   *
   * @returns Promise<AuthorType[]> - list of author type records
   */
  async findAll(): Promise<AuthorType[]> {
    return this.prisma.authorType.findMany();
  }

  /**
   * Returns a single author type by id.
   *
   * Throws `EntityNotFoundException` when the provided id does not map
   * to an existing record.
   *
   * @param id - entity id of the author type
   * @returns Promise<AuthorType> - the found author type
   * @throws EntityNotFoundException when not found
   */
  async findOne(id: string): Promise<AuthorType> {
    const existingType = await this.prisma.authorType.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new EntityNotFoundException('Тип автора', 'id', `${id}`);
    }

    return existingType;
  }

  /**
   * Verify that every id in `roleIds` corresponds to an existing
   * author type.
   *
   * Returns `true` when `roleIds` is empty or when all provided ids
   * exist in the database.
   *
   * @param roleIds - array of author type ids to check
   * @returns Promise<boolean> - whether all ids exist
   */
  async checkTypesExist(roleIds: string[]): Promise<boolean> {
    if (roleIds.length === 0) return true;

    const existingRoles = await this.prisma.authorType.findMany({
      where: {
        id: { in: roleIds },
      },
      select: { id: true },
    });

    return existingRoles.length === roleIds.length;
  }

  /**
   * Find an author type by its human-readable `type` string.
   *
   * The search is case-insensitive and returns `null` when no match is
   * found.
   *
   * @param type - human-readable author type
   * @returns Promise<AuthorType | null>
   */
  async findByType(type: string): Promise<AuthorType | null> {
    return this.prisma.authorType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
