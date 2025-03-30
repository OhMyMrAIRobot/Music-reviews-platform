import { Injectable } from '@nestjs/common';
import { AuthorOnType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesService } from 'src/author-types/author-types.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { CreateAuthorsOnTypeDto } from './dto/create-authors-on-type.dto';
import { DeleteAuthorsOnTypeDto } from './dto/delete-authors-on-type.dto';

@Injectable()
export class AuthorsOnTypesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorsService: AuthorsService,
    private readonly authorTypesService: AuthorTypesService,
  ) {}

  async create(
    createAuthorsOnTypeDto: CreateAuthorsOnTypeDto,
  ): Promise<AuthorOnType> {
    const { authorId, authorTypeId } = createAuthorsOnTypeDto;

    await this.authorsService.findOne(authorId);
    await this.authorTypesService.findOne(authorTypeId);

    const existing = await this.findById(authorId, authorTypeId);
    if (existing) {
      throw new DuplicateFieldException('Автор', 'id типа', `${authorTypeId}`);
    }

    return this.prisma.authorOnType.create({
      data: createAuthorsOnTypeDto,
    });
  }

  async findAll(): Promise<AuthorOnType[]> {
    return this.prisma.authorOnType.findMany();
  }

  async findByAuthorId(authorId: string): Promise<AuthorOnType[]> {
    const result = await this.prisma.authorOnType.findMany({
      where: { authorId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Типы авторов',
        'id автора',
        `${authorId}`,
      );
    }

    return result;
  }

  async remove(
    deleteAuthorsOnTypeDto: DeleteAuthorsOnTypeDto,
  ): Promise<AuthorOnType> {
    const { authorId, authorTypeId } = deleteAuthorsOnTypeDto;

    const existing = await this.findById(authorId, authorTypeId);
    if (!existing) {
      throw new EntityNotFoundException('Автор', 'id типа', `${authorTypeId}`);
    }

    return this.prisma.authorOnType.delete({
      where: { authorId_authorTypeId: deleteAuthorsOnTypeDto },
    });
  }

  private async findById(
    authorId: string,
    authorTypeId: string,
  ): Promise<AuthorOnType | null> {
    return this.prisma.authorOnType.findUnique({
      where: { authorId_authorTypeId: { authorId, authorTypeId } },
    });
  }
}
