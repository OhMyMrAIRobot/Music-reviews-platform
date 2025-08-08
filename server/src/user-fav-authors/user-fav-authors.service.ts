import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavAuthor } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavAuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authorsService: AuthorsService,
  ) {}

  async create(authorId: string, userId: string): Promise<UserFavAuthor> {
    await this.usersService.findOne(userId);
    await this.authorsService.findOne(authorId);

    const exist = await this.findOne(userId, authorId);
    if (exist) {
      throw new ConflictException(
        'Вы уже отметили данного автора как понравившегося!',
      );
    }

    return this.prisma.userFavAuthor.create({
      data: { authorId, userId },
    });
  }

  async findByUserId(userId: string): Promise<UserFavAuthor[]> {
    await this.usersService.findOne(userId);

    return this.prisma.userFavAuthor.findMany({
      where: { userId },
    });
  }

  async findByAuthorId(authorId: string): Promise<UserFavAuthor[]> {
    await this.authorsService.findOne(authorId);

    return this.prisma.userFavAuthor.findMany({
      where: { authorId },
    });
  }

  async remove(authorId: string, userId: string): Promise<UserFavAuthor> {
    await this.authorsService.findOne(authorId);
    await this.usersService.findOne(userId);

    const exist = await this.findOne(userId, authorId);

    if (!exist) {
      throw new ConflictException(
        'Вы не отмечали данного автора как понравившегося!',
      );
    }

    return this.prisma.userFavAuthor.delete({
      where: { userId_authorId: { userId, authorId } },
    });
  }

  async findOne(
    userId: string,
    authorId: string,
  ): Promise<UserFavAuthor | null> {
    return this.prisma.userFavAuthor.findUnique({
      where: { userId_authorId: { userId, authorId } },
    });
  }
}
