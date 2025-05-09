import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReleaseReviewQueryDto } from './dto/release-review-query.dto';
import {
  ReleaseReview,
  ReleaseReviewResponseDto,
} from './dto/release-review.response.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import {
  ReviewQueryDataDto,
  ReviewsResponseDto,
} from './dto/reviews.response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = createReviewDto;

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (existing) {
      throw new DuplicateFieldException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    const total = this.calculateTotalScore(
      createReviewDto.rhymes,
      createReviewDto.structure,
      createReviewDto.realization,
      createReviewDto.individuality,
      createReviewDto.atmosphere,
    );

    return this.prisma.review.create({
      data: { ...createReviewDto, total, userId },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }

  async findOne(id: string): Promise<Review> {
    const existing = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new EntityNotFoundException('Рецензия', 'id', `${id}`);
    }

    return existing;
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const existing = await this.prisma.review.findMany({
      where: { userId },
    });
    if (existing.length === 0) {
      throw new EntityNotFoundException('Рецензии', 'userId', `${userId}`);
    }

    return existing;
  }

  async findByReleaseId(
    releaseId: string,
    query: ReleaseReviewQueryDto,
  ): Promise<ReleaseReviewResponseDto> {
    await this.releasesService.findOne(releaseId);
    const count = await this.prisma.review.count({
      where: {
        releaseId,
        text: { not: null },
      },
    });

    const fieldMap: Record<string, string> = {
      created: 'r.created_at',
      likes: 'likes_count',
    };

    const field = query.field ? fieldMap[query.field] : fieldMap['created'];
    const order = query.order ? query.order : 'desc';
    const limit = query.limit ? query.limit : 5;
    const offset = query.offset ? query.offset : 0;

    const rawQuery = `
        SELECT
          r.id,
          r.rhymes,
          r.structure,
          r.realization,
          r.individuality,
          r.atmosphere,
          r.total,
          r.title,
          r.text,
          (
              SELECT TO_CHAR(r.created_at, 'DD-MM-YYYY') AS created_at
          ),
          u.id AS user_id,
          u.nickname,
          up.avatar,
          up.points,
          tul.rank AS position,
          COUNT(DISTINCT ufr.user_id)::INT as likes_count,
          JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'userId', ufr.user_id,
              'reviewId', ufr.review_id
            )) as user_fav_ids
        FROM "Reviews" r
        LEFT JOIN "Users" u on r.user_id = u.id
        LEFT JOIN "User_profiles" up on u.id = up.user_id
        LEFT JOIN "Top_users_leaderboard" tul ON up.user_id = tul.user_id
        LEFT JOIN "User_fav_reviews" ufr on r.id = ufr.review_id
        WHERE r.release_id = '${releaseId}'
        GROUP BY r.id, r.rhymes, r.structure, r.realization, r.individuality, r.atmosphere, r.total, r.title, r.text, u.id, u.nickname, up.avatar, tul.rank, r.created_at, up.points
        ORDER BY ${field} ${order}, r.id ASC
        LIMIT ${limit}
        OFFSET ${offset}`;

    const reviews =
      await this.prisma.$queryRawUnsafe<ReleaseReview[]>(rawQuery);

    return { count, reviews };
  }

  async update(
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = updateReviewDto;

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    const total = this.calculateTotalScore(
      updateReviewDto.rhymes,
      updateReviewDto.structure,
      updateReviewDto.realization,
      updateReviewDto.individuality,
      updateReviewDto.atmosphere,
    );

    return this.prisma.review.update({
      where: { userId_releaseId: { userId, releaseId } },
      data: {
        ...updateReviewDto,
        total,
        text: updateReviewDto.text ?? null,
        title: updateReviewDto.title ?? null,
      },
    });
  }

  async remove(
    deleteReviewDto: DeleteReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = deleteReviewDto;
    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.review.delete({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  async findReviews(query: ReviewsQueryDto): Promise<ReviewsResponseDto> {
    const count = await this.prisma.review.count({
      where: {
        AND: [
          { text: { not: null } },
          { userId: { equals: query.userId } },
          {
            UserFavReviews: query.favUserId
              ? { some: { userId: query.favUserId } }
              : undefined,
          },
        ],
      },
    });

    const order = query.order ? query.order : 'desc';
    const limit = query.limit ? query.limit : 45;
    const offset = query.offset ? query.offset : 0;

    const rawQuery = `
      SELECT
          rev.id,
          rev.title,
          rev.text,
          rev.total,
          rev.rhymes,
          rev.structure,
          rev.realization,
          rev.individuality,
          rev.atmosphere,
          rev.user_id,
          u.nickname,
          p.avatar AS profile_img,
          p.points,
          tul.rank AS position,
          r.img AS release_img,
          r.title AS release_title,
          r.id AS release_id,
          COUNT(DISTINCT ufr.user_id)::int AS likes_count,
          json_agg(DISTINCT jsonb_build_object(
              'userId', ufr.user_id,
              'reviewId', ufr.review_id
          )) AS user_fav_ids
      FROM "Reviews" rev
            LEFT JOIN "Users" u ON rev.user_id = u.id
            LEFT JOIN "User_profiles" p ON u.id = p.user_id
            LEFT JOIN "Top_users_leaderboard" tul ON p.user_id = tul.user_id
            LEFT JOIN "Releases" r ON rev.release_id = r.id
            LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
      WHERE rev.text IS NOT NULL 
        AND rev.title IS NOT NULL
        ${query.userId ? `AND rev.user_id = '${query.userId}'` : ''}
        ${query.favUserId ? `AND ufr.user_id = '${query.favUserId}'` : ''}
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, tul.rank,
          r.img, r.title, r.id, rev.created_at, rev.user_id
      ORDER BY rev.created_at ${order}
      LIMIT ${limit}
      OFFSET ${offset}`;

    const reviews =
      await this.prisma.$queryRawUnsafe<ReviewQueryDataDto[]>(rawQuery);

    return { count, reviews };
  }

  async findByAuthorId(authorId: string): Promise<ReviewQueryDataDto[]> {
    return this.prisma.$queryRawUnsafe(`
      WITH author_releases AS (
        SELECT release_id FROM "Release_designers" WHERE author_id = '${authorId}'
        UNION
        SELECT release_id FROM "Release_producers" WHERE author_id = '${authorId}'
        UNION
        SELECT release_id FROM "Release_artists" WHERE author_id = '${authorId}'
      )

      SELECT
          rev.id,
          rev.title,
          rev.text,
          rev.total,
          rev.rhymes,
          rev.structure,
          rev.realization,
          rev.individuality,
          rev.atmosphere,
          rev.user_id,
          u.nickname,
          p.avatar AS profile_img,
          p.points,
          tul.rank AS position,
          r.img AS release_img,
          r.title AS release_title,
          r.id AS release_id,
          COUNT(DISTINCT ufr.user_id)::int AS likes_count,
          json_agg(DISTINCT jsonb_build_object(
                  'userId', ufr.user_id,
                  'reviewId', ufr.review_id
          )) AS user_fav_ids
      FROM "Reviews" rev
              LEFT JOIN "Users" u ON rev.user_id = u.id
              LEFT JOIN "User_profiles" p ON u.id = p.user_id
              LEFT JOIN "Top_users_leaderboard" tul ON p.user_id = tul.user_id
              LEFT JOIN "Releases" r ON rev.release_id = r.id
              LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
              JOIN author_releases ar ON r.id = ar.release_id
      WHERE rev.text IS NOT NULL AND rev.title IS NOT NULL
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, tul.rank,
          r.img, r.title, r.id, rev.created_at, rev.user_id
      ORDER BY rev.created_at desc
      LIMIT 25
      OFFSET 0
      `);
  }

  private calculateTotalScore(
    rhymes: number,
    structure: number,
    realization: number,
    individuality: number,
    atmosphere: number,
  ): number {
    const baseScore = rhymes + structure + realization + individuality;

    const multipliedBaseScore = baseScore * 1.4;

    const atmosphereMultiplier = 1 + (atmosphere - 1) * 0.06747;

    return Math.round(multipliedBaseScore * atmosphereMultiplier);
  }

  private async findByUserIdReleaseId(
    userId: string,
    releaseId: string,
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
