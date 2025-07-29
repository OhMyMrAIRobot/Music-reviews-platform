import { Injectable } from '@nestjs/common';
import { ReleaseMediaType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseMediaTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ReleaseMediaType[]> {
    return this.prisma.releaseMediaType.findMany();
  }

  async findOne(id: string): Promise<ReleaseMediaType> {
    const type = await this.prisma.releaseMediaType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new EntityNotFoundException('Тип медиа', 'id', id);
    }

    return type;
  }
}
