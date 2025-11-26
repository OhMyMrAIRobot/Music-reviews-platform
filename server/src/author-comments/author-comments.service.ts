import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorComment, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisteredAuthorsService } from 'src/registered-authors/registered-authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { SortOrder } from 'src/shared/types/sort-order.type';
import { AuthorCommentsQueryDto } from './dto/query/author-comments.query.dto';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';
import { AuthorCommentDto } from './dto/response/author-comment.dto';
import { AuthorCommentsResponseDto } from './dto/response/author-comments.response.dto';
import {
  AuthorCommentsRawQueryArrayDto,
  AuthorCommentsRawQueryDto,
} from './types/author-comments-raw-query.dto';

@Injectable()
export class AuthorCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releasesService: ReleasesService,
    private readonly registeredAuthorsService: RegisteredAuthorsService,
  ) {}

  /**
   * Create a new author comment associated with a release.
   *
   * Validations:
   * - ensures the user is a registered author for the target release
   * - prevents multiple comments from the same author for a release
   *
   * @param dto the create payload validated by DTO decorators
   * @param userId id of the authenticated user creating the comment
   * @returns newly created `AuthorCommentDto`
   * @throws ForbiddenException when the user already created a comment
   */
  async create(
    dto: CreateAuthorCommentRequestDto,
    userId: string,
  ): Promise<AuthorCommentDto> {
    await this.registeredAuthorsService.checkUserIsReleaseAuthor(
      userId,
      dto.releaseId,
    );
    const exist = await this.findByUserReleaseIds(userId, dto.releaseId);

    if (exist) {
      throw new ForbiddenException(
        'Вы уже оставляли авторский комментарий на данный релиз!',
      );
    }

    const created = await this.prisma.authorComment.create({
      data: {
        userId,
        ...dto,
      },
    });

    return this.findById(created.id);
  }

  /**
   * Load a single author comment by id and return a normalized DTO.
   *
   * Implementation uses `executeRawQuery` which returns a JSON payload
   * with `items` and `meta`. We return the first item or throw when not
   * found to provide a consistent API surface.
   *
   * @param id comment id
   * @returns `AuthorCommentDto`
   * @throws EntityNotFoundException when comment is missing
   */
  async findById(id: string): Promise<AuthorCommentDto> {
    const { result } = await this.executeRawQuery({ id });

    if (result.items.length === 0) {
      throw new EntityNotFoundException('Комментарий автора', 'id', id);
    }

    return result.items[0];
  }

  /**
   * Return all author comments for a given release.
   *
   * Validates that the `releaseId` exists and delegates aggregation to the
   * centralized raw SQL query.
   *
   * @param releaseId id of the release
   * @returns `AuthorCommentsResponseDto` (items + meta)
   */
  async findByReleaseId(releaseId: string): Promise<AuthorCommentsResponseDto> {
    await this.releasesService.findOne(releaseId);

    const { result } = await this.executeRawQuery({ releaseId });

    return result;
  }

  /**
   * Search and list author comments according to provided query filters.
   *
   * Delegates filtering, aggregation and pagination to the raw SQL query
   * to keep behaviour consistent and performant for complex joins/aggregates.
   *
   * @param query query DTO with filters, pagination and sorting
   * @returns `AuthorCommentsResponseDto` with `items` and `meta`
   */
  async findAll(
    query: AuthorCommentsQueryDto,
  ): Promise<AuthorCommentsResponseDto> {
    if (query.releaseId) {
      await this.releasesService.findOne(query.releaseId);
    }

    const { result } = await this.executeRawQuery(query);

    return result;
  }

  /**
   * Update an existing author comment.
   *
   * Behaviour:
   * - ensures the comment exists
   * - enforces ownership when `userId` is provided (non-admin flows)
   * - re-validates that the acting user is a registered author for the
   *   comment's release when an author performs the update
   *
   * @param id comment id
   * @param dto partial update payload
   * @param userId optional acting user id used for ownership checks
   * @returns updated `AuthorCommentDto`
   */
  async update(
    id: string,
    dto: UpdateAuthorCommentRequestDto,
    userId?: string,
  ): Promise<AuthorCommentDto> {
    const comment = await this.findOne(id);
    if (userId && userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }

    if (userId) {
      await this.registeredAuthorsService.checkUserIsReleaseAuthor(
        userId,
        comment.releaseId,
      );
    }

    const updated = await this.prisma.authorComment.update({
      where: { id },
      data: dto,
    });

    return this.findById(updated.id);
  }

  /**
   * Delete an author comment.
   *
   * Enforces ownership when `userId` is provided; admin callers can omit
   * `userId` to bypass ownership checks. Re-validates the acting user's
   * registration as an author for the release when applicable.
   *
   * @param id comment id
   * @param userId optional acting user id for ownership checks
   */
  async delete(id: string, userId?: string) {
    const comment = await this.findOne(id);

    if (userId && userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }

    if (userId) {
      await this.registeredAuthorsService.checkUserIsReleaseAuthor(
        userId,
        comment.releaseId,
      );
    }

    await this.prisma.authorComment.delete({
      where: { id },
    });

    return;
  }

  /**
   * Internal helper: load raw Prisma entity for the comment by id.
   * Throws `EntityNotFoundException` when missing.
   */
  private async findOne(id: string): Promise<AuthorComment> {
    const comment = await this.prisma.authorComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new EntityNotFoundException('Комментарий автора', 'id', id);
    }
    return comment;
  }

  /**
   * Find a comment created by a specific user for a specific release.
   * Used to prevent duplicate author comments.
   */
  private async findByUserReleaseIds(
    userId: string,
    releaseId: string,
  ): Promise<AuthorComment | null> {
    return this.prisma.authorComment.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  /**
   * Execute the centralized raw SQL query used by listing endpoints.
   *
   * The query returns a single JSON column named `result` with the shape
   * matching `AuthorCommentsResponseDto`: { items: [...], meta: { count } }.
   *
   * @param params filter/sort/pagination parameters
   * @returns `AuthorCommentsRawQueryDto` wrapper containing `result`
   */
  private async executeRawQuery(params: {
    id?: string;
    releaseId?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortOrder?: SortOrder;
  }): Promise<AuthorCommentsRawQueryDto> {
    const {
      id = null,
      releaseId = null,
      search = null,
      limit = null,
      offset = null,
      sortOrder = null,
    } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${id}::text as id,
              ${releaseId}::text as release_id,
              ${limit}::int AS limit_,
              ${offset}::int AS offset_,
              ${search}::text AS search,
              ${sortOrder}::text AS sort_order
      ),

          user_author_types AS (
              SELECT
                  ra.user_id,
                  jsonb_agg(DISTINCT jsonb_build_object(
                          'id', at.id,
                          'type', at.type)
                  ) AS types
              FROM "Registered_authors" ra
                  JOIN "Authors_on_types" aot ON aot.author_id = ra.author_id
                  JOIN "Author_types" at ON at.id = aot.author_type_id
              GROUP BY ra.user_id
          ),

          user_comments_count AS (
              SELECT
                  user_id,
                  COUNT(*)::int AS total_comments
              FROM "Author_comments"
              GROUP BY user_id
          ),

          user_author_like_count AS (
              SELECT
                  user_id,
                  SUM(cnt)::int AS total_author_likes
              FROM (
                      SELECT
                          ufr.user_id,
                          COUNT(*)::int AS cnt
                      FROM "User_fav_reviews" ufr
                          JOIN "Reviews" rv ON rv.id = ufr.review_id
                      WHERE EXISTS (
                          SELECT 1
                          FROM "Registered_authors" ra
                          WHERE ra.user_id = ufr.user_id
                              AND ra.author_id IN (
                                  SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rv.release_id
                                  UNION
                                  SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = rv.release_id
                                  UNION
                                  SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = rv.release_id
                          )
                      )
                      GROUP BY ufr.user_id

                      UNION ALL

                      SELECT
                          ufm.user_id,
                          COUNT(*)::int AS cnt
                      FROM "User_fav_media" ufm
                          JOIN "Release_media" rm ON rm.id = ufm.media_id
                      WHERE EXISTS (
                          SELECT 1
                          FROM "Registered_authors" ra
                          WHERE ra.user_id = ufm.user_id
                              AND ra.author_id IN (
                                  SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rm.release_id
                                  UNION
                                  SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = rm.release_id
                                  UNION
                                  SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = rm.release_id
                              )
                      )
                      GROUP BY ufm.user_id
              ) z
              GROUP BY user_id
          ),

          filtered_comments AS (
              SELECT ac.*
              FROM "Author_comments" ac
                  JOIN params p ON TRUE
                  JOIN "Users" u ON u.id = ac.user_id
                  JOIN "Releases" r ON r.id = ac.release_id
              WHERE
                  (p.id IS NULL OR p.id = ac.id)
                  AND (p.release_id IS NULL OR p.release_id = ac.release_id)
                  AND (
                      (p.search IS NULL OR p.search = '')
                      OR (
                          ac.title ILIKE '%' || p.search || '%'
                              OR ac.text ILIKE '%' || p.search || '%'
                              OR r.title ILIKE '%' || p.search || '%'
                              OR EXISTS (
                                  SELECT 1
                                  FROM (
                                      SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = ac.release_id
                                      UNION
                                      SELECT ra2.author_id FROM "Release_artists" ra2 WHERE ra2.release_id = ac.release_id
                                      UNION
                                      SELECT rd2.author_id FROM "Release_designers" rd2 WHERE rd2.release_id = ac.release_id
                                  ) rel_auth
                                      JOIN "Authors" a ON a.id = rel_auth.author_id
                                  WHERE a.name ILIKE '%' || p.search || '%'
                              )
                          )
                  )
          ),

          agg_stats AS (
              SELECT COUNT(*)::int AS total_count
              FROM filtered_comments
          ),

          comments_page AS (
              SELECT
                  jsonb_build_object(
                          'id', ac.id,
                          'title', ac.title,
                          'text', ac.text,
                          'createdAt', ac.created_at,
                          'user', jsonb_build_object(
                                  'id', u.id,
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
                          'author', jsonb_build_object(
                                  'type', COALESCE((SELECT types FROM user_author_types WHERE user_id = u.id), '[]'::jsonb),
                                  'totalComments', COALESCE(ucc.total_comments, 0),
                                  'totalAuthorLikes', COALESCE(ualc.total_author_likes, 0)
                                  )
                  ) AS comment_json
              FROM filtered_comments ac
                  JOIN params p ON TRUE
                  LEFT JOIN "Users" u ON u.id = ac.user_id
                  LEFT JOIN "User_profiles" up ON up.user_id = u.id
                  LEFT JOIN "Top_users_leaderboard" tul ON tul.user_id = u.id
                  LEFT JOIN "Releases" r ON r.id = ac.release_id
                  LEFT JOIN user_comments_count ucc ON ucc.user_id = u.id
                  LEFT JOIN user_author_like_count ualc ON ualc.user_id = u.id

              ORDER BY
                  CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'asc' THEN ac.created_at END ASC NULLS LAST,
                  CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'desc' THEN ac.created_at END DESC NULLS LAST,
                  ac.id DESC

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
                          JSONB_AGG(comment_json) FILTER (WHERE comment_json IS NOT NULL),
                          '[]'::jsonb
                      ) AS items
          FROM comments_page
      ) items
      CROSS JOIN agg_stats agg;
      `;

    const [response] =
      await this.prisma.$queryRaw<AuthorCommentsRawQueryArrayDto>(sql);

    return response;
  }
}
