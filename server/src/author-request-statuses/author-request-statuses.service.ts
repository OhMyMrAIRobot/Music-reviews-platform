import { Injectable } from '@nestjs/common';
import { AuthorRequestStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class AuthorRequestStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuthorRequestStatus[]> {
    return this.prisma.authorRequestStatus.findMany();
  }

  async findOne(id: string): Promise<AuthorRequestStatus> {
    const status = await this.prisma.authorRequestStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new EntityNotFoundException(
        'Статус подтверждения автора',
        'id',
        id,
      );
    }

    return status;
  }
}
