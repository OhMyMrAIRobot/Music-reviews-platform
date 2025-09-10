import { Injectable } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { DuplicateFieldException } from 'src/shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { UsersService } from 'src/users/users.service';
import { CreateReviewRequestDto } from './dto/request/create-review.request.dto';
import { FindReviewsByAuthorIdQuery } from './dto/request/query/find-reviews-by-author-id.query.dto';
import { FindReviewsByReleaseIdQuery } from './dto/request/query/find-reviews-by-release-id.query.dto';
import { FindReviewsQuery } from './dto/request/query/find-reviews.query.dto';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import {
  AdminFindReviewsResponseDto,
  AdminReview,
} from './dto/response/admin-find-reviews.response.dto';
import { FindReviewByUserReleaseIdsResponseDto } from './dto/response/find-review-by-user-release-ids.response.dto';
import {
  FindReviewsByReleaseIdResponseDto,
  ReleaseReview,
} from './dto/response/find-reviews-by-release-id.response.dto';
import {
  FindReviewsResponseDto,
  ReviewQueryDataDto,
} from './dto/response/find-reviews.response.dto';
import { ReviewSortFieldsEnum } from './types/review-sort-fields.enum';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(dto: CreateReviewRequestDto, userId: string): Promise<Review> {
    const { releaseId } = dto;

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
      dto.rhymes,
      dto.structure,
      dto.realization,
      dto.individuality,
      dto.atmosphere,
    );

    return this.prisma.review.create({
      data: { ...dto, total, userId },
    });
  }

  async findAll(query: FindReviewsQuery): Promise<AdminFindReviewsResponseDto> {
    const { limit, offset, order, query: searchTerm } = query;

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

  async findByUserReleaseIds(
    userId: string,
    releaseId: string,
  ): Promise<FindReviewByUserReleaseIdsResponseDto> {
    await this.releasesService.findOne(releaseId);
    await this.usersService.findOne(userId);

    const exist = await this.prisma.review.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });

    if (!exist) {
      throw new EntityNotFoundException(
        'Рецензия/оценка',
        'userId и releaseId',
        `${userId} ${releaseId}`,
      );
    }

    return plainToInstance(FindReviewByUserReleaseIdsResponseDto, exist, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    dto: UpdateReviewRequestDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.checkBelongsToUser(id, userId);

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(review.releaseId);

    const total = this.calculateTotalScore(
      dto.rhymes ?? review.rhymes,
      dto.structure ?? review.structure,
      dto.realization ?? review.realization,
      dto.individuality ?? review.individuality,
      dto.atmosphere ?? review.atmosphere,
    );

    return this.prisma.review.update({
      where: { id: review.id },
      data: {
        ...dto,
        total,
        title: dto.title ?? null,
        text: dto.text ?? null,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Review> {
    const review = await this.checkBelongsToUser(id, userId);

    return this.prisma.review.delete({
      where: { id: review.id },
    });
  }

  async findByReleaseId(
    releaseId: string,
    query: FindReviewsByReleaseIdQuery,
  ): Promise<FindReviewsByReleaseIdResponseDto> {
    await this.releasesService.findOne(releaseId);
    const count = await this.prisma.review.count({
      where: {
        releaseId,
        text: { not: null },
      },
    });

    const fieldMap: Record<string, string> = {
      [ReviewSortFieldsEnum.CREATED]: 'r.created_at',
      [ReviewSortFieldsEnum.LIKES]: '"favCount"',
    };

    const field = query.field
      ? fieldMap[query.field]
      : fieldMap[ReviewSortFieldsEnum.CREATED];
    const { limit, offset = 0, order = 'desc' } = query;

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
                SELECT TO_CHAR(r.created_at, 'DD-MM-YYYY') AS "createdAt"
            ),
            u.id AS "userId",
            u.nickname,
            up.avatar,
            up.points,
            tul.rank AS position,
            COUNT(DISTINCT ufr.user_id)::INT AS "favCount",
            CASE
                WHEN COUNT(ufr.user_id) = 0 THEN '[]'::json
                ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                        'userId', ufr.user_id,
                        'reviewId', ufr.review_id
                ))
                END AS "userFavReview",
            CASE
                WHEN COUNT(ufr.user_id) FILTER (
                    WHERE EXISTS (
                        SELECT 1
                        FROM "Registered_authors" ra
                        WHERE ra.user_id = ufr.user_id
                          AND ra.author_id IN (
                            SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = r.release_id
                            UNION
                            SELECT ra2.author_id FROM "Release_artists" ra2 WHERE ra2.release_id = r.release_id
                            UNION
                            SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = r.release_id
                        )
                    )
                    ) = 0 THEN '[]'::json
                ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                        'userId', ufr.user_id,
                        'reviewId', ufr.review_id,
                        'nickname', u2.nickname,
                        'avatar', COALESCE(up2.avatar, '')
                    )) FILTER (
                        WHERE EXISTS (
                        SELECT 1
                        FROM "Registered_authors" ra
                        WHERE ra.user_id = ufr.user_id
                          AND ra.author_id IN (
                            SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = r.release_id
                            UNION
                            SELECT ra2.author_id FROM "Release_artists" ra2 WHERE ra2.release_id = r.release_id
                            UNION
                            SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = r.release_id
                        )
                ))
                END AS "authorFavReview"
        FROM "Reviews" r
                LEFT JOIN "Users" u ON r.user_id = u.id
                LEFT JOIN "User_profiles" up ON u.id = up.user_id
                LEFT JOIN "Top_users_leaderboard" tul ON up.user_id = tul.user_id
                LEFT JOIN "User_fav_reviews" ufr ON r.id = ufr.review_id
                LEFT JOIN "Users" u2 ON u2.id = ufr.user_id
                LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
        WHERE r.release_id = '${releaseId}'
        GROUP BY
            r.id, r.rhymes, r.structure, r.realization, r.individuality, r.atmosphere, r.total, r.title, r.text,
            u.id, u.nickname, up.avatar, tul.rank, r.created_at, up.points
        ORDER BY ${field} ${order}, r.id ASC
        ${limit !== undefined ? `LIMIT ${limit}` : ''}
        OFFSET ${offset}`;

    const reviews =
      await this.prisma.$queryRawUnsafe<ReleaseReview[]>(rawQuery);

    return { count, reviews };
  }

  async findReviews(query: FindReviewsQuery): Promise<FindReviewsResponseDto> {
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

    const { limit, offset = 0, order = 'desc' } = query;

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
          rev.user_id as "userId",
          u.nickname,
          p.avatar AS "profileImg",
          p.points,
          tul.rank AS position,
          r.img AS "releaseImg",
          r.title AS "releaseTitle",
          r.id AS "releaseId",
          COUNT(DISTINCT ufr.user_id)::int AS "favCount",
          CASE
              WHEN count(ufr.user_id) = 0 THEN '[]'::json
              ELSE json_agg(DISTINCT jsonb_build_object(
                  'userId', ufr.user_id,
                  'reviewId', ufr.review_id
              )) FILTER (WHERE ufr.user_id IS NOT NULL)
          END AS "userFavReview",
          CASE
              WHEN COUNT(ufr.user_id) FILTER (
                  WHERE EXISTS (
                      SELECT 1
                      FROM "Registered_authors" ra
                      WHERE ra.user_id = ufr.user_id
                        AND ra.author_id IN (
                          SELECT rp.author_id FROM "Release_producers" rp
                          WHERE rp.release_id = rev.release_id
                          UNION
                          SELECT ra2.author_id FROM "Release_artists" ra2
                          WHERE ra2.release_id = rev.release_id
                          UNION
                          SELECT rd.author_id FROM "Release_designers" rd
                          WHERE rd.release_id = rev.release_id
                      )
                  )
                  ) = 0 THEN '[]'::json
              ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                      'userId', ufr.user_id,
                      'reviewId', ufr.review_id,
                      'nickname', u2.nickname,
                      'avatar', up2.avatar
                  )) FILTER (
                      WHERE EXISTS (
                          SELECT 1
                          FROM "Registered_authors" ra
                          WHERE ra.user_id = ufr.user_id
                            AND ra.author_id IN (
                              SELECT rp.author_id FROM "Release_producers" rp
                              WHERE rp.release_id = rev.release_id
                              UNION
                              SELECT ra2.author_id FROM "Release_artists" ra2
                              WHERE ra2.release_id = rev.release_id
                              UNION
                              SELECT rd.author_id FROM "Release_designers" rd
                              WHERE rd.release_id = rev.release_id
                          )
                      )
                  )
          END AS "authorFavReview"
      FROM "Reviews" rev
              LEFT JOIN "Users" u ON rev.user_id = u.id
              LEFT JOIN "User_profiles" p ON u.id = p.user_id
              LEFT JOIN "Top_users_leaderboard" tul ON p.user_id = tul.user_id
              LEFT JOIN "Releases" r ON rev.release_id = r.id
              LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
              LEFT JOIN "Users" u2 ON u2.id = ufr.user_id
              LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
      WHERE rev.id IN (SELECT id FROM filtered_reviews)
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, tul.rank,
          r.img, r.title, r.id, rev.created_at, rev.user_id
      ORDER BY rev.created_at ${order}, rev.id ASC
      ${limit !== undefined ? `LIMIT ${limit}` : ''}
      OFFSET ${offset}`;

    const reviews =
      await this.prisma.$queryRawUnsafe<ReviewQueryDataDto[]>(rawQuery);

    return { count, reviews };
  }

  async findByAuthorId(
    authorId: string,
    query: FindReviewsByAuthorIdQuery,
  ): Promise<ReviewQueryDataDto[]> {
    const { limit, offset = 0 } = query;

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
          rev.user_id as "userId",
          u.nickname,
          p.avatar AS "profileImg",
          p.points,
          tul.rank AS position,
          r.img AS "releaseImg",
          r.title AS "releaseTitle",
          r.id AS "releaseId",
          COUNT(DISTINCT ufr.user_id)::int AS "favCount",
          CASE
            WHEN count(ufr.user_id) = 0 THEN '[]'::json
            ELSE json_agg(DISTINCT jsonb_build_object(
                  'userId', ufr.user_id,
                  'reviewId', ufr.review_id
            )) 
          END AS "userFavReview",
          CASE
            WHEN COUNT(ufr.user_id) FILTER (
                WHERE EXISTS (
                    SELECT 1
                    FROM "Registered_authors" ra
                    WHERE ra.user_id = ufr.user_id
                      AND ra.author_id IN (
                        SELECT rp.author_id FROM "Release_producers" rp
                        WHERE rp.release_id = rev.release_id
                        UNION
                        SELECT ra2.author_id FROM "Release_artists" ra2
                        WHERE ra2.release_id = rev.release_id
                        UNION
                        SELECT rd.author_id FROM "Release_designers" rd
                        WHERE rd.release_id = rev.release_id
                    )
                )
                ) = 0 THEN '[]'::json
            ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                    'userId', ufr.user_id,
                    'reviewId', ufr.review_id,
                    'nickname', u2.nickname,
                    'avatar', up2.avatar
                                  )) FILTER (
                    WHERE EXISTS (
                    SELECT 1
                    FROM "Registered_authors" ra
                    WHERE ra.user_id = ufr.user_id
                      AND ra.author_id IN (
                        SELECT rp.author_id FROM "Release_producers" rp
                        WHERE rp.release_id = rev.release_id
                        UNION
                        SELECT ra2.author_id FROM "Release_artists" ra2
                        WHERE ra2.release_id = rev.release_id
                        UNION
                        SELECT rd.author_id FROM "Release_designers" rd
                        WHERE rd.release_id = rev.release_id
                    )
                )
            )
          END AS "authorFavReview"
      FROM "Reviews" rev
              LEFT JOIN "Users" u ON rev.user_id = u.id
              LEFT JOIN "User_profiles" p ON u.id = p.user_id
              LEFT JOIN "Top_users_leaderboard" tul ON p.user_id = tul.user_id
              LEFT JOIN "Releases" r ON rev.release_id = r.id
              LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
              JOIN author_releases ar ON r.id = ar.release_id
              LEFT JOIN "Users" u2 ON u2.id = ufr.user_id
              LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
      WHERE rev.text IS NOT NULL AND rev.title IS NOT NULL
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, tul.rank,
          r.img, r.title, r.id, rev.created_at, rev.user_id
      ORDER BY rev.created_at desc, rev.id ASC
      ${limit !== undefined ? `LIMIT ${limit}` : ''}
      OFFSET ${offset}
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
