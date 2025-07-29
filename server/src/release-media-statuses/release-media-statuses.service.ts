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

  async findOne(id: string): Promise<ReleaseMediaStatus> {
    const status = await this.prisma.releaseMediaStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new EntityNotFoundException('Статус медиа', 'id', id);
    }

    return status;
  }
}
