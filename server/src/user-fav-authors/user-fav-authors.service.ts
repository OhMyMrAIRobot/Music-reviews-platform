import { Injectable } from '@nestjs/common';
import { UserFavAuthor } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { CreateUserFavAuthorDto } from './dto/create-user-fav-author.dto';
import { DeleteUserFavAuthorDto } from './dto/delete-user-fav-author.dto';

@Injectable()
export class UserFavAuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authorsService: AuthorsService,
  ) {}

  async create(
    createUserFavAuthorDto: CreateUserFavAuthorDto,
    userId: string,
  ): Promise<UserFavAuthor> {
    const { authorId } = createUserFavAuthorDto;

    await this.usersService.findOne(userId);
    await this.authorsService.findOne(authorId);

    const existing = await this.findOne(userId, authorId);
    if (existing) {
      throw new DuplicateFieldException(
        `Пользователь с id '${userId}' и`,
        'id автора',
        `${authorId}`,
      );
    }

    return this.prisma.userFavAuthor.create({
      data: { ...createUserFavAuthorDto, userId },
    });
  }

  async findAll(): Promise<UserFavAuthor[]> {
    return this.prisma.userFavAuthor.findMany();
  }

  async findByUserId(userId: string): Promise<UserFavAuthor[]> {
    const result = await this.prisma.userFavAuthor.findMany({
      where: { userId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Понравившиеся авторы',
        'id пользователя',
        `${userId}`,
      );
    }
    return result;
  }

  async findByAuthorId(authorId: string): Promise<UserFavAuthor[]> {
    const result = await this.prisma.userFavAuthor.findMany({
      where: { authorId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Пользователи, которорым понравилcя автора',
        'id',
        `${authorId}`,
      );
    }
    return result;
  }

  async remove(
    deleteUserFavAuthorDto: DeleteUserFavAuthorDto,
    userId: string,
  ): Promise<UserFavAuthor> {
    const { authorId } = deleteUserFavAuthorDto;

    const existing = await this.findOne(userId, authorId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Пользователь с id '${userId}' и`,
        'id автора',
        `${authorId}`,
      );
    }

    return this.prisma.userFavAuthor.delete({
      where: { userId_authorId: { ...deleteUserFavAuthorDto, userId } },
    });
  }

  private async findOne(
    userId: string,
    authorId: string,
  ): Promise<UserFavAuthor | null> {
    return this.prisma.userFavAuthor.findUnique({
      where: { userId_authorId: { userId, authorId } },
    });
  }
}
