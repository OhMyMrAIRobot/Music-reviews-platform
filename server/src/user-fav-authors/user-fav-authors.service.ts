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

  /**
   * Add an author to user's favorites.
   *
   * Validates that both user and author exist, ensures the favorite
   * doesn't already exist, then creates the association.
   *
   * @param authorId - id of the author to favorite
   * @param userId - id of the user adding the favorite
   * @returns created UserFavAuthor record
   * @throws ConflictException when the author is already favorited
   */
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

  /**
   * Retrieve all favorite authors for a specific user.
   *
   * Validates that the user exists before fetching their favorites.
   *
   * @param userId - id of the user whose favorites to retrieve
   * @returns array of UserFavAuthor records
   */
  async findByUserId(userId: string): Promise<UserFavAuthor[]> {
    await this.usersService.findOne(userId);

    return this.prisma.userFavAuthor.findMany({
      where: { userId },
    });
  }

  /**
   * Retrieve all users who favorited a specific author.
   *
   * Validates that the author exists before fetching favorites.
   *
   * @param authorId - id of the author to get favorites for
   * @returns array of UserFavAuthor records
   */
  async findByAuthorId(authorId: string): Promise<UserFavAuthor[]> {
    await this.authorsService.findOne(authorId);

    return this.prisma.userFavAuthor.findMany({
      where: { authorId },
    });
  }

  /**
   * Remove an author from user's favorites.
   *
   * Validates that both user and author exist, ensures the favorite
   * exists, then removes the association.
   *
   * @param authorId - id of the author to unfavorite
   * @param userId - id of the user removing the favorite
   * @returns deleted UserFavAuthor record
   * @throws ConflictException when the author was not favorited
   */
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

  /**
   * Check if a specific user-author favorite relationship exists.
   *
   * Internal helper used to prevent duplicates and validate removals.
   *
   * @param userId - id of the user
   * @param authorId - id of the author
   * @returns UserFavAuthor record if exists, null otherwise
   */
  async findOne(
    userId: string,
    authorId: string,
  ): Promise<UserFavAuthor | null> {
    return this.prisma.userFavAuthor.findUnique({
      where: { userId_authorId: { userId, authorId } },
    });
  }
}
