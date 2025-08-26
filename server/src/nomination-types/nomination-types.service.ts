import { Injectable } from '@nestjs/common';
import { NominationType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class NominationTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<NominationType> {
    const type = await this.prisma.nominationType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new EntityNotFoundException('Тип номинации', 'id', id);
    }

    return type;
  }

  async findAll(): Promise<NominationType[]> {
    return this.prisma.nominationType.findMany();
  }
}
