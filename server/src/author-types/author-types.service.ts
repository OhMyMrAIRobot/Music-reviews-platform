import { Injectable } from '@nestjs/common';
import { AuthorType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { CreateAuthorTypeDto } from './dto/create-author-type.dto';
import { UpdateAuthorTypeDto } from './dto/update-author-type.dto';

@Injectable()
export class AuthorTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorTypeDto: CreateAuthorTypeDto): Promise<AuthorType> {
    const existingType = await this.findByType(createAuthorTypeDto.type);

    if (existingType) {
      throw new DuplicateFieldException(
        'Тип автора',
        'названием',
        `${existingType.type}`,
      );
    }

    return this.prisma.authorType.create({
      data: createAuthorTypeDto,
    });
  }

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

  async update(
    id: string,
    updateAuthorTypeDto: UpdateAuthorTypeDto,
  ): Promise<AuthorType> {
    if (!updateAuthorTypeDto || Object.keys(updateAuthorTypeDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);

    if (updateAuthorTypeDto.type) {
      const existingType = await this.findByType(updateAuthorTypeDto.type);

      if (existingType) {
        throw new DuplicateFieldException(
          'Тип автора',
          'названием',
          `${existingType.type}`,
        );
      }
    }

    return this.prisma.authorType.update({
      where: { id },
      data: updateAuthorTypeDto,
    });
  }

  async remove(id: string): Promise<AuthorType> {
    await this.findOne(id);

    return this.prisma.authorType.delete({
      where: { id },
    });
  }

  private async findByType(type: string): Promise<AuthorType | null> {
    return this.prisma.authorType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
