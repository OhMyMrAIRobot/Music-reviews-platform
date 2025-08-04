import { Injectable } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/exceptions/insufficient-permissions.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import {
  AdminFindReviewsResponseDto,
  AdminReview,
} from './dto/admin-find-reviews.response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
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

    const existing = await this.prisma.review.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });

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

  async findAll(query: ReviewsQueryDto): Promise<AdminFindReviewsResponseDto> {
    const { limit = 10, offset = 0, order, query: searchTerm } = query;

    const where: Prisma.ReviewWhereInput = {
      title: { not: null },
      text: { not: null },
    };

    if (searchTerm) {
      where.AND = [
        {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { text: { contains: searchTerm, mode: 'insensitive' } },
            {
              release: {
                title: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            {
              user: {
                nickname: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          ],
        },
      ];
    }

    const [count, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ createdAt: order ?? 'desc' }, { id: 'desc' }],
        include: {
          release: { select: { id: true, title: true, img: true } },
          user: {
            select: {
              id: true,
              nickname: true,
              profile: { select: { avatar: true } },
            },
          },
        },
      }),
    ]);

    return {
      count,
      reviews: plainToInstance(AdminReview, reviews, {
        excludeExtraneousValues: true,
      }),
    };
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
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.checkBelongsToUser(id, userId);

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(review.releaseId);

    const total = this.calculateTotalScore(
      updateReviewDto.rhymes ?? review.rhymes,
      updateReviewDto.structure ?? review.structure,
      updateReviewDto.realization ?? review.realization,
      updateReviewDto.individuality ?? review.individuality,
      updateReviewDto.atmosphere ?? review.atmosphere,
    );

    return this.prisma.review.update({
      where: { id: review.id },
      data: {
        ...updateReviewDto,
        total,
        title: updateReviewDto.title ?? null,
        text: updateReviewDto.text ?? null,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Review> {
    const review = await this.checkBelongsToUser(id, userId);

    return this.prisma.review.delete({
      where: { id: review.id },
    });
  }

  async findReviews(query: ReviewsQueryDto): Promise<ReviewsResponseDto> {
    const count = await this.prisma.review.count({
      where: {
        AND: [
          { text: { not: null } },
          { userId: { equals: query.userId } },
          {
            userFavReviews: query.favUserId
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
      WITH filtered_reviews AS (
        SELECT rev.id
        FROM "Reviews" rev
        LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
        WHERE rev.text IS NOT NULL 
          AND rev.title IS NOT NULL
          ${query.userId ? `AND rev.user_id = '${query.userId}'` : ''}
          ${query.favUserId ? `AND ufr.user_id = '${query.favUserId}'` : ''}
        GROUP BY rev.id
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
          )) FILTER (WHERE ufr.user_id IS NOT NULL) AS user_fav_ids
      FROM "Reviews" rev
      LEFT JOIN "Users" u ON rev.user_id = u.id
      LEFT JOIN "User_profiles" p ON u.id = p.user_id
      LEFT JOIN "Top_users_leaderboard" tul ON p.user_id = tul.user_id
      LEFT JOIN "Releases" r ON rev.release_id = r.id
      LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
      WHERE rev.id IN (SELECT id FROM filtered_reviews)
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, tul.rank,
          r.img, r.title, r.id, rev.created_at, rev.user_id
      ORDER BY rev.created_at ${order}, rev.id ASC
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
      ORDER BY rev.created_at desc, rev.id ASC
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

  private async checkBelongsToUser(
    reviewId: string,
    userId: string,
  ): Promise<Review> {
    const review = await this.findOne(reviewId);

    if (review.userId !== userId) {
      throw new InsufficientPermissionsException();
    }

    return review;
  }
}
