import { Injectable } from '@nestjs/common';
import { AuthorConfirmationStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';

@Injectable()
export class AuthorConfirmationStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuthorConfirmationStatus[]> {
    return this.prisma.authorConfirmationStatus.findMany();
  }

  async findOne(id: string): Promise<AuthorConfirmationStatus> {
    const status = await this.prisma.authorConfirmationStatus.findUnique({
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

  async findByStatus(status: string): Promise<AuthorConfirmationStatus> {
    const exist = await this.prisma.authorConfirmationStatus.findFirst({
      where: { status: { equals: status, mode: 'insensitive' } },
    });

    if (!exist) {
      throw new EntityNotFoundException(
        'Статус подтверждения автора',
        'названием',
        status,
      );
    }

    return exist;
  }
}
