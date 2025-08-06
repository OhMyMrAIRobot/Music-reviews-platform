import { Injectable } from '@nestjs/common';
import { ReleaseType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ReleaseType[]> {
    return this.prisma.releaseType.findMany();
  }

  async findOne(id: string): Promise<ReleaseType> {
    const existingType = await this.prisma.releaseType.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new EntityNotFoundException('Тип релиза', 'id', `${id}`);
    }

    return existingType;
  }

  async findByType(type: string): Promise<ReleaseType | null> {
    return this.prisma.releaseType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
