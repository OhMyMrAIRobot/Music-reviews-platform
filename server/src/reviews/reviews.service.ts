import { Prisma, Review } from '.prisma/client/default';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { DuplicateFieldException } from 'src/shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { SortOrder } from 'src/shared/types/sort-order.type';
import { UsersService } from 'src/users/users.service';
import { CreateReviewRequestDto } from './dto/request/create-review.request.dto';
import { ReviewsQueryDto } from './dto/request/query/reviews.query.dto';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import { ReviewDto } from './dto/response/review.dto';
import { ReviewsResponseDto } from './dto/response/reviews.response.dto';
import { ReviewSortFieldsEnum } from './types/review-sort-fields.enum';
import {
  ReviewsRawQueryArrayDto,
  ReviewsRawQueryDto,
} from './types/reviews-raw-query.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
    private readonly authorsService: AuthorsService,
  ) {}

  /**
   * Create a review on behalf of `userId`.
   *
   * Validates that the user and the referenced release exist, prevents
   * duplicate reviews by the same user for the same release, computes the
   * aggregated `total` score and returns the created review mapped to
   * `ReviewDto`.
   *
   * @param dto review creation payload
   * @param userId id of the authenticated user creating the review
   * @returns created `ReviewDto`
   */
  async create(
    dto: CreateReviewRequestDto,
    userId: string,
  ): Promise<ReviewDto> {
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

    const created = await this.prisma.review.create({
      data: { ...dto, total, userId },
    });

    return this.findById(created.id);
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

  /**
   * Load a raw review entity by id and return a normalized `Review` DTO.
   *
   * The implementation uses `executeRawQuery` to produce a consistent
   * JSON response. If no item is found an `EntityNotFoundException` is
   * thrown.
   *
   * @param id review id
   * @returns populated `ReviewDto`
   * @throws EntityNotFoundException when the review is not found
   */
  async findById(id: string): Promise<ReviewDto> {
    const response = await this.executeRawQuery({ id });

    if (response.result.items.length === 0) {
      throw new EntityNotFoundException('Рецензия', 'id', id);
    }

    return response.result.items[0];
  }

  /**
   * Search and list reviews according to `ReviewsQueryDto`.
   *
   * Delegates filtering, aggregation and sorting to `executeRawQuery`
   * to keep behaviour consistent and performant for complex joins and
   * lateral aggregates.
   *
   * @param query Query DTO with filters, pagination and sorting
   * @returns `ReviewsResponseDto` containing `items` and `meta`
   */
  async findAll(query: ReviewsQueryDto): Promise<ReviewsResponseDto> {
    if (query.favUserId) await this.usersService.findOne(query.favUserId);
    if (query.authorId) await this.authorsService.findOne(query.authorId);

    const response = await this.executeRawQuery({
      userId: query.userId,
      authorId: query.authorId,
      favUserId: query.favUserId,
      search: query.search,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      authorLikesOnly: query.hasAuthorLikes,
      limit: query.limit,
      offset: query.offset,
      releaseId: query.releaseId,
      withTextOnly: query.withTextOnly,
    });

    return response.result;
  }

  /**
   * Update an existing review. Only the owner of the review can perform
   * the update — ownership is validated via `checkBelongsToUser`.
   *
   * Behaviour:
   * - validates referenced entities (user, release)
   * - recalculates review total score from rating parts
   * - persists partial updates and normalizes nullable fields
   *
   * @param id review id
   * @param dto Partial update payload
   * @param userId id of the user performing the update
   * @returns updated `ReviewDto`
   */
  async update(
    id: string,
    dto: UpdateReviewRequestDto,
    userId?: string,
  ): Promise<ReviewDto> {
    let review: Review;
    if (userId) {
      review = await this.checkBelongsToUser(id, userId);
      await this.usersService.findOne(userId);
    } else {
      review = await this.findOne(id);
    }

    if (dto.releaseId) {
      await this.releasesService.findOne(dto.releaseId);
    }

    const total = this.calculateTotalScore(
      dto.rhymes ?? review.rhymes,
      dto.structure ?? review.structure,
      dto.realization ?? review.realization,
      dto.individuality ?? review.individuality,
      dto.atmosphere ?? review.atmosphere,
    );

    const updated = await this.prisma.review.update({
      where: { id: review.id },
      data: {
        ...dto,
        total,
        title: dto.title ?? null,
        text: dto.text ?? null,
      },
    });

    return this.findById(updated.id);
  }

  /**
   * Remove a review by id.
   *
   * When `userId` is provided the method validates ownership and will
   * only allow the owner to delete. When called without `userId` (e.g.
   * by an admin route) the check is skipped and the review is removed.
   *
   * @param id review id
   * @param userId optional id of the requesting user (owner enforcement)
   */
  async remove(id: string, userId?: string) {
    if (userId) {
      await this.checkBelongsToUser(id, userId);
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return;
  }

  /**
   * Calculate a review's total score from individual rating parts.
   *
   * The function applies a fixed multiplier and an atmosphere-based
   * adjustment to produce an integer total used for sorting and display.
   *
   * @param rhymes score for rhymes
   * @param structure score for structure
   * @param realization score for realization
   * @param individuality score for individuality
   * @param atmosphere atmosphere score
   * @returns rounded integer total score
   */
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

  /**
   * Ensure the specified review exists and belongs to the given user.
   *
   * Used to enforce ownership for update and delete operations.
   *
   * @param reviewId id of the review to check
   * @param userId id of the user expected to own the review
   * @returns the `Review` entity when validation succeeds
   * @throws InsufficientPermissionsException when the review does not belong to the user
   */
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

  private async executeRawQuery(params: {
    id?: string;
    userId?: string;
    authorId?: string;
    releaseId?: string;
    favUserId?: string;
    search?: string;
    sortField?: ReviewSortFieldsEnum;
    sortOrder?: SortOrder;
    authorLikesOnly?: boolean;
    withTextOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ReviewsRawQueryDto> {
    const {
      id = null,
      userId = null,
      authorId = null,
      releaseId = null,
      favUserId = null,
      search = null,
      sortField = null,
      sortOrder = null,
      authorLikesOnly = null,
      withTextOnly = null,
      limit = null,
      offset = null,
    } = params;

    /**
     * Centralized raw SQL for listing and aggregating reviews.
     *
     * The query accepts filter/sort/pagination parameters via a CTE named
     * `params` and returns a single JSON column `result` with shape:
     * { items: ReviewDto[], meta: { count: number } }.
     *
     * Using raw SQL keeps complex lateral joins and aggregates performant
     * and ensures consistent output for controllers.
     */
    const sql = Prisma.sql`
			WITH params AS (
					SELECT
							${id}::text as id_,
							${userId}::text AS user_id,
							${authorId}::text AS author_id,
              ${releaseId}::text AS release_id,
							${favUserId}::text AS fav_user_id,
							${search}::text AS search,
							${sortField}::text AS sort_field,
							${sortOrder}::text AS sort_order,
							${authorLikesOnly}::boolean AS author_likes_only,
              ${withTextOnly}::boolean AS with_text_only,
							${limit}::int AS limit_,
							${offset}::int AS offset_
			),

					filtered_reviews AS (
							SELECT rev.*
							FROM "Reviews" rev
									JOIN params p ON TRUE
							WHERE (p.id_ IS NULL OR rev.id = p.id_)
                  AND (p.with_text_only IS NULL OR p.with_text_only = FALSE OR (rev.title IS NOT NULL AND rev.text IS NOT NULL))
									AND (p.user_id IS NULL OR rev.user_id = p.user_id)
                  AND (p.release_id IS NULL OR rev.release_id = p.release_id)
									AND (p.fav_user_id IS NULL OR EXISTS (
											SELECT 1
											FROM "User_fav_reviews" ufr
											WHERE ufr.review_id = rev.id
													AND ufr.user_id = p.fav_user_id
									))
									AND (p.author_id IS NULL
											OR EXISTS (
													SELECT 1
													FROM "Release_artists" ra
													WHERE ra.release_id = rev.release_id
															AND ra.author_id = p.author_id
											)
											OR EXISTS (
													SELECT 1
													FROM "Release_producers" rp
													WHERE rp.release_id = rev.release_id
															AND rp.author_id = p.author_id
											)
											OR EXISTS (
													SELECT 1
													FROM "Release_designers" rd
													WHERE rd.release_id = rev.release_id
															AND rd.author_id = p.author_id
											)
									)
									AND (p.search IS NULL
											OR ( rev.title ILIKE '%' || p.search || '%'
											OR rev.text ILIKE '%' || p.search || '%')
									)
									AND (p.author_likes_only IS NULL OR p.author_likes_only = FALSE
											OR EXISTS (
													SELECT 1
													FROM "User_fav_reviews" ufr_a
															JOIN "Registered_authors" ra_a ON ra_a.user_id = ufr_a.user_id
													WHERE ufr_a.review_id = rev.id
															AND ra_a.author_id IN (
																	SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rev.release_id
																	UNION
																	SELECT ra2.author_id FROM "Release_artists" ra2 WHERE ra2.release_id = rev.release_id
																	UNION
																	SELECT rd2.author_id FROM "Release_designers" rd2 WHERE rd2.release_id = rev.release_id
															)
											)
									)
					),

					agg_stats AS (
							SELECT COUNT(*)::int AS total_count
							FROM filtered_reviews
					),

					reviews_page AS (
							SELECT
									jsonb_build_object(
													'id', rev.id,
													'title', rev.title,
													'text', rev.text,
													'values', jsonb_build_object(
																	'total', rev.total,
																	'rhymes', rev.rhymes,
																	'structure', rev.structure,
																	'realization', rev.realization,
																	'individuality', rev.individuality,
																	'atmosphere', rev.atmosphere
																	),
													'user', jsonb_build_object(
																	'id', rev.user_id,
																	'nickname', u.nickname,
																	'avatar', up.avatar,
																	'points', up.points,
																	'rank', tul.rank
																	),
													'release', jsonb_build_object(
																	'id', r.id,
																	'title', r.title,
																	'img', r.img
																	),
													'userFavReview', COALESCE(ufr_arr.userFavReview, '[]'::jsonb),
													'authorFavReview', COALESCE(afr_arr.authorFavReview, '[]'::jsonb),
													'createdAt', rev.created_at
									) AS review_json,
									sorter.sort_value AS sort_value
							FROM filtered_reviews rev
									JOIN params p ON TRUE
									LEFT JOIN "Users" u ON u.id = rev.user_id
									LEFT JOIN "User_profiles" up ON up.user_id = u.id
									LEFT JOIN "Top_users_leaderboard" tul ON tul.user_id = up.user_id
									LEFT JOIN "Releases" r ON r.id = rev.release_id

									LEFT JOIN LATERAL (
											SELECT COUNT(*)::int AS likes_count
											FROM "User_fav_reviews" ufr2
											WHERE ufr2.review_id = rev.id
									) likes ON TRUE

									LEFT JOIN LATERAL (
											SELECT COALESCE(
																	JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
																							'userId', ufr.user_id,
																							'reviewId', ufr.review_id
																			)) FILTER (WHERE ufr.user_id IS NOT NULL),
																	'[]'::jsonb
											) AS userFavReview
											FROM "User_fav_reviews" ufr
											WHERE ufr.review_id = rev.id
									) ufr_arr ON TRUE

									LEFT JOIN LATERAL (
											SELECT COALESCE(
																	JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
																							'userId', ufr.user_id,
																							'avatar', up2.avatar,
																							'nickname', u2.nickname,
																							'reviewId', ufr.review_id
																			)) FILTER (WHERE ufr.user_id IS NOT NULL),
																	'[]'::jsonb
											) AS authorFavReview
									FROM "User_fav_reviews" ufr
											JOIN "Users" u2 ON u2.id = ufr.user_id
											LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
									WHERE ufr.review_id = rev.id
											AND EXISTS (
													SELECT 1
													FROM "Registered_authors" ra
													WHERE ra.user_id = ufr.user_id
															AND ra.author_id IN (
																	SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rev.release_id
																	UNION
																	SELECT ra3.author_id FROM "Release_artists" ra3 WHERE ra3.release_id = rev.release_id
																	UNION
																	SELECT rd3.author_id FROM "Release_designers" rd3 WHERE rd3.release_id = rev.release_id
															)
											)
									) afr_arr ON TRUE

									LEFT JOIN LATERAL (
											SELECT
													CASE
															WHEN p.sort_field = 'created' THEN EXTRACT(EPOCH FROM rev.created_at)::bigint
															WHEN p.sort_field = 'likes' THEN COALESCE(likes.likes_count, 0)::int
															ELSE NULL
													END AS sort_value
									) sorter ON TRUE

							ORDER BY
									CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'asc' THEN sorter.sort_value END ASC NULLS LAST,
									CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'desc' THEN sorter.sort_value END DESC NULLS LAST,
									rev.id DESC

							LIMIT (SELECT limit_ FROM params)
							OFFSET (SELECT offset_ FROM params)
					)

			SELECT
					jsonb_build_object(
									'items', items.items,
									'meta', jsonb_build_object(
															'count', agg.total_count
													)
					) AS result
			FROM (
					SELECT COALESCE(
											JSONB_AGG(review_json) FILTER (WHERE review_json IS NOT NULL),
											'[]'::jsonb
								) AS items
					FROM reviews_page
			) items
			CROSS JOIN agg_stats agg;
		`;

    const [response] =
      await this.prisma.$queryRaw<ReviewsRawQueryArrayDto>(sql);

    return response;
  }
}
