import { Injectable } from '@nestjs/common';
import { ReleaseMediaStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';

@Injectable()
export class ReleaseMediaStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ReleaseMediaStatus[]> {
    return this.prisma.releaseMediaStatus.findMany();
  }

  async findById(id: string): Promise<ReleaseMediaStatus> {
    const status = await this.prisma.releaseMediaStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new EntityNotFoundException('Статус медиа', 'id', id);
    }

    return status;
  }

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
