import { Injectable } from '@nestjs/common';
import { AuthorType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';

@Injectable()
export class AuthorTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuthorType[]> {
    return this.prisma.authorType.findMany();
  }

  async findOne(id: string): Promise<AuthorType> {
    const existingType = await this.prisma.authorType.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new EntityNotFoundException('Тип автора', 'id', `${id}`);
    }

    return existingType;
  }

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

  async findByType(type: string): Promise<AuthorType | null> {
    return this.prisma.authorType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
