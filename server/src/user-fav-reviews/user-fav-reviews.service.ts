import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserFavReview } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { FindAuthorLikesQuery } from './dto/query/find-author-likes.query.dto';
import {
  AuthorLikeItemDto,
  FindAuthorLikesResponseDto,
} from './dto/response/find-author-likes.response.dto';
import { FindUserFavByReviewIdResponseDto } from './dto/response/find-user-fav-by-review-id.response.dto';
import { AuthorLikesRaw } from './dto/types/author-likes-raw';

@Injectable()
export class UserFavReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(reviewId: string, userId: string): Promise<UserFavReview> {
    await this.usersService.findOne(userId);
    const review = await this.reviewsService.findOne(reviewId);

    if (userId === review.userId) {
      throw new ConflictException(
        'Вы не можете отметить свою рецензию как понравившеюся!',
      );
    }

    if (!review.text || !review.title) {
      throw new ForbiddenException(
        'Вы не можете отметить оценку как понравившеюся!',
      );
    }

    const existing = await this.findOne(userId, reviewId);
    if (existing) {
      throw new ConflictException(
        'Вы уже отметили данную рецензию как понравившеюся!',
      );
    }

    return this.prisma.userFavReview.create({
      data: { reviewId, userId },
    });
  }

  async findAuthorLikes(
    query: FindAuthorLikesQuery,
  ): Promise<FindAuthorLikesResponseDto> {
    const { limit, offset = 0 } = query;

    const totalRowsPromise = this.prisma.$queryRawUnsafe<{ count: number }[]>(`
      SELECT COUNT(*)::int AS count
      FROM "User_fav_reviews" ufr
      JOIN "Reviews" rev ON rev.id = ufr.review_id
      WHERE EXISTS (
        SELECT 1
        FROM "Registered_authors" ra
        WHERE ra.user_id = ufr.user_id
          AND ra.author_id IN (
            SELECT rp.author_id 
            FROM "Release_producers" rp 
            WHERE rp.release_id = rev.release_id
            UNION
            SELECT ar.author_id 
            FROM "Release_artists" ar 
            WHERE ar.release_id = rev.release_id
            UNION
            SELECT rd.author_id 
            FROM "Release_designers" rd 
            WHERE rd.release_id = rev.release_id
          )
      );
    `);

    const itemsRowsPromise = this.prisma.$queryRawUnsafe<AuthorLikesRaw[]>(`
      SELECT
        ru.id AS "reviewAuthorId",
        ru.nickname AS "reviewAuthorNickname",
        upr.avatar AS "reviewAuthorAvatar",
        rev.title AS "reviewTitle",

        lu.id AS "likerUserId",
        lu.nickname AS "likerNickname",
        upl.avatar AS "likerAvatar",

        r.id AS "releaseId",
        r.title AS "releaseTitle",
        r.img as "releaseImg",

        ufr.created_at AS "createdAt"
      FROM "User_fav_reviews" ufr
      JOIN "Reviews" rev ON rev.id = ufr.review_id
      JOIN "Users" ru ON ru.id = rev.user_id
      LEFT JOIN "User_profiles" upr ON upr.user_id = ru.id
      JOIN "Users" lu ON lu.id = ufr.user_id
      LEFT JOIN "User_profiles" upl ON upl.user_id = lu.id
      JOIN "Releases" r ON r.id = rev.release_id
      WHERE EXISTS (
        SELECT 1
        FROM "Registered_authors" ra
        WHERE ra.user_id = ufr.user_id
          AND ra.author_id IN (
            SELECT rp.author_id 
            FROM "Release_producers" rp 
            WHERE rp.release_id = rev.release_id
            UNION
            SELECT ar.author_id 
            FROM "Release_artists" ar 
            WHERE ar.release_id = rev.release_id
            UNION
            SELECT rd.author_id 
            FROM "Release_designers" rd 
            WHERE rd.release_id = rev.release_id
          )
      )
      ORDER BY ufr.created_at DESC, ufr.review_id DESC
      ${limit !== undefined ? `LIMIT ${limit}` : ''} OFFSET ${offset};
    `);

    const [[{ count }], rows] = await Promise.all([
      totalRowsPromise,
      itemsRowsPromise,
    ]);

    const items: AuthorLikeItemDto[] = rows.map((r) => ({
      reviewAuthor: {
        id: r.reviewAuthorId,
        nickname: r.reviewAuthorNickname,
        avatar: r.reviewAuthorAvatar,
      },
      author: {
        id: r.likerUserId,
        nickname: r.likerNickname,
        avatar: r.likerAvatar,
      },
      release: {
        id: r.releaseId,
        title: r.releaseTitle,
        img: r.releaseImg,
      },
      reviewTitle: r.reviewTitle,
    }));

    return plainToInstance(
      FindAuthorLikesResponseDto,
      { count, items },
      { excludeExtraneousValues: true },
    );
  }

  async findByReviewId(
    reviewId: string,
  ): Promise<FindUserFavByReviewIdResponseDto> {
    const reviewWithRelease = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        release: {
          select: {
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
      },
    });

    if (!reviewWithRelease) {
      throw new EntityNotFoundException('Рецензия', 'id', reviewId);
    }

    const favs = await this.prisma.userFavReview.findMany({
      where: { reviewId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true } },
            registeredAuthor: { select: { authorId: true } },
          },
        },
      },
    });

    return plainToInstance(
      FindUserFavByReviewIdResponseDto,
      {
        userFavReview: favs,
        review: { release: reviewWithRelease.release },
      },
      { excludeExtraneousValues: true },
    );
  }

  async remove(reviewId: string, userId: string) {
    await this.reviewsService.findOne(reviewId);
    await this.usersService.findOne(userId);

    const existing = await this.findOne(userId, reviewId);
    if (!existing) {
      throw new ConflictException(
        'Вы не отмечали данную рецензию как понравившеюся!',
      );
    }

    return this.prisma.userFavReview.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }

  async findOne(
    userId: string,
    reviewId: string,
  ): Promise<UserFavReview | null> {
    return this.prisma.userFavReview.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }
}
