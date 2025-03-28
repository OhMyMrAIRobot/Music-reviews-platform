import { Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.findByName(createAuthorDto.name);

    if (existingAuthor) {
      throw new DuplicateFieldException(
        'Автор',
        'именем',
        `${existingAuthor.name}`,
      );
    }

    return this.prisma.author.create({
      data: createAuthorDto,
    });
  }

  async findAll(): Promise<Author[]> {
    return this.prisma.author.findMany();
  }

  async findOne(id: string): Promise<Author> {
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      throw new EntityNotFoundException('Автор', 'id', `${id}`);
    }

    return existingAuthor;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    if (!updateAuthorDto || Object.keys(updateAuthorDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);
    if (updateAuthorDto.name) {
      const existingAuthor = await this.findByName(updateAuthorDto.name);

      if (existingAuthor) {
        throw new DuplicateFieldException(
          'Автор',
          'именем',
          `${existingAuthor.name}`,
        );
      }
    }

    return this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  async remove(id: string): Promise<Author> {
    await this.findOne(id);

    return this.prisma.author.delete({
      where: { id },
    });
  }

  private async findByName(name: string): Promise<Author | null> {
    return this.prisma.author.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }
}
