import { Injectable } from '@nestjs/common';
import { NominationType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class NominationTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns a single nomination type by id.
   *
   * Throws `EntityNotFoundException` when no matching nomination type
   * is found for the provided `id`.
   *
   * @param id - entity id of the nomination type
   * @returns Promise<NominationType>
   * @throws EntityNotFoundException when not found
   */
  async findOne(id: string): Promise<NominationType> {
    const type = await this.prisma.nominationType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new EntityNotFoundException('Тип номинации', 'id', id);
    }

    return type;
  }

  /**
   * Returns all available nomination types defined in the system.
   *
   * @returns Promise<NominationType[]>
   */
  async findAll(): Promise<NominationType[]> {
    return this.prisma.nominationType.findMany();
  }
}
