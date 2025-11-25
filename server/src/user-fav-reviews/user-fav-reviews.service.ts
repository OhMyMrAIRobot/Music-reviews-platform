import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, UserFavReview } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { AuthorLikeQueryDto } from './dto/query/author-like.query.dto';
import { AuthorLikesResponseDto } from './dto/response/author-likes.response.dto';
import {
  AuthorLikeRawQueryArrayDto,
  AuthorLikeRawQueryDto,
} from './dto/types/author-like-raw-query.dto';

@Injectable()
export class UserFavReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  /**
   * Mark a review as favorited by a user.
   *
   * Validations:
   * - ensures the `user` and `review` exist
   * - prevents marking own review as favorite
   * - only reviews with both `title` and `text` can be favorited
   * - prevents duplicate favorite records
   *
   * @param reviewId ID of the review to favorite
   * @param userId ID of the user who favorites the review
   * @returns created `UserFavReview` Prisma entity
   * @throws ConflictException when the action is not allowed or duplicate
   * @throws ForbiddenException when the review cannot be favorited
   */
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

  /**
   * Remove an existing favorite relation for a review by a user.
   *
   * Validations:
   * - ensures the `review` and `user` exist
   * - ensures the favorite record exists before deletion
   *
   * @param reviewId ID of the review
   * @param userId ID of the user who previously favorited the review
   * @returns void
   * @throws ConflictException when the favorite does not exist
   */
  async remove(reviewId: string, userId: string) {
    await this.reviewsService.findOne(reviewId);
    await this.usersService.findOne(userId);

    const existing = await this.findOne(userId, reviewId);
    if (!existing) {
      throw new ConflictException(
        'Вы не отмечали данную рецензию как понравившеюся!',
      );
    }

    await this.prisma.userFavReview.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });

    return;
  }

  /**
   * Return a paginated list of author-like records.
   *
   * This endpoint lists users who are registered authors and have favorited
   * reviews for releases they are associated with. Aggregation and pagination
   * are delegated to `executeAuthorLikesRawQuery` which returns a JSON payload
   * with `items` and `meta` keys.
   *
   * @param query Pagination query DTO
   * @returns `AuthorLikesResponseDto` containing `items` and `meta`
   */
  async findAuthorLikes(
    query: AuthorLikeQueryDto,
  ): Promise<AuthorLikesResponseDto> {
    const { result } = await this.executeAuthorLikesRawQuery(query);

    return result;
  }

  /**
   * Find a single favorite relation by `userId` and `reviewId`.
   * @returns `UserFavReview` or `null` when not found
   */
  private async findOne(
    userId: string,
    reviewId: string,
  ): Promise<UserFavReview | null> {
    return this.prisma.userFavReview.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }

  /**
   * Execute the raw SQL aggregation used to produce the author-likes listing.
   *
   * The raw query returns a single JSON column named `result` with the shape
   * matching `AuthorLikesResponseDto`: { items: [...], meta: { count } }.
   *
   * @param params Object with optional `limit` and `offset` for pagination
   * @returns `AuthorLikeRawQueryDto` wrapper containing the `result` payload
   */
  private async executeAuthorLikesRawQuery(params: {
    limit?: number;
    offset?: number;
  }): Promise<AuthorLikeRawQueryDto> {
    const { limit = null, offset = null } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${limit}::int AS limit_,
              ${offset}::int AS offset_
      ),

          filtered_favs AS (
              SELECT ufr.*
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
          ),

          agg_stats AS (
              SELECT COUNT(*)::int AS total_count
              FROM filtered_favs
          ),

          reviews_page AS (
              SELECT
                  jsonb_build_object(
                          'title', rev.title,
                          'createdAt', rev.created_at,
                          'user', jsonb_build_object(
                                  'id', ru.id,
                                  'nickname', ru.nickname,
                                  'avatar', upr.avatar
                          )
                  ) AS review,

                  jsonb_build_object(
                          'id', lu.id,
                          'nickname', lu.nickname,
                          'avatar', upl.avatar
                  ) AS author,

                  jsonb_build_object(
                          'id', r.id,
                          'title', r.title,
                          'img', r.img
                  ) AS release,

                  ufr.created_at AS ufr_created_at,
                  ufr.review_id AS ufr_review_id

              FROM filtered_favs ufr
                  JOIN "Reviews" rev ON rev.id = ufr.review_id
                  JOIN "Users" ru ON ru.id = rev.user_id
                  LEFT JOIN "User_profiles" upr ON upr.user_id = ru.id
                  JOIN "Users" lu ON lu.id = ufr.user_id
                  LEFT JOIN "User_profiles" upl ON upl.user_id = lu.id
                  JOIN "Releases" r ON r.id = rev.release_id
              ORDER BY ufr.created_at DESC, ufr.review_id DESC
              LIMIT (SELECT limit_ FROM params)
              OFFSET (SELECT offset_ FROM params)
          )

      SELECT
          jsonb_build_object(
              'items', COALESCE(
                          JSONB_AGG(
                              jsonb_build_object(
                                  'review', rp.review,
                                  'author', rp.author,
                                  'release', rp.release
                              )
                          ) FILTER (WHERE rp.review IS NOT NULL),
                          '[]'::jsonb),

              'meta', jsonb_build_object(
                      'count', agg.total_count
                      )
          ) AS result

      FROM reviews_page rp
      CROSS JOIN agg_stats agg
      GROUP BY agg.total_count
    `;

    const [result] =
      await this.prisma.$queryRaw<AuthorLikeRawQueryArrayDto>(sql);

    return result;
  }
}
