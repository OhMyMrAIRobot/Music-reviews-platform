import { Injectable } from '@nestjs/common';
import { ReleaseMediaType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseMediaTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ReleaseMediaType[]> {
    return this.prisma.releaseMediaType.findMany();
  }

  async findById(id: string): Promise<ReleaseMediaType> {
    const type = await this.prisma.releaseMediaType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new EntityNotFoundException('Тип медиа', 'id', id);
    }

    return type;
  }

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
