import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleasesService } from 'src/releases/releases.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { SortOrder } from 'src/shared/types/sort-order.type';
import { UsersService } from 'src/users/users.service';
import { ReleaseMediaStatusesService } from '../../src/release-media-statuses/release-media-statuses.service';
import { ReleaseMediaTypesService } from '../../src/release-media-types/release-media-types.service';
import { CreateReleaseMediaDto } from './dto/create-release-media.dto';
import { ReleaseMediaQueryDto } from './dto/request/query/release-media.query.dto';
import { ReleaseMediaDto } from './dto/response/release-media.dto';
import { ReleaseMediaResponseDto } from './dto/response/release-media.response.dto';
import { UpdateReleaseMediaDto } from './dto/update-release-media.dto';
import {
  ReleaseMediaRawQueryArrayDto,
  ReleaseMediaRawQueryDto,
} from './types/release-media-raw-query.dto';

@Injectable()
export class ReleaseMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
    private readonly releasesService: ReleasesService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  /**
   * Create a new release media entry.
   *
   * Validations:
   * - ensures referenced `releaseId` exists
   * - when `userId` is provided, ensures the user has left a review for the release
   * - prevents duplicate media by URL
   *
   * Side-effects:
   * - creates a `ReleaseMedia` record in the database
   *
   * @param dto CreateReleaseMediaDto - payload for creating a media entry
   * @returns Promise<ReleaseMediaDto> created media normalized as DTO
   * @throws BadRequestException when required related entities are missing
   * @throws ConflictException when a media entry with the same URL already exists
   */
  async create(dto: CreateReleaseMediaDto): Promise<ReleaseMediaDto> {
    await this.releasesService.findOne(dto.releaseId);

    let reviewId: string | null = null;

    if (dto.userId) {
      await this.usersService.findOne(dto.userId);

      const existByUserRelease = await this.prisma.releaseMedia.count({
        where: {
          AND: [{ releaseId: dto.releaseId }, { userId: dto.userId }],
        },
      });

      if (existByUserRelease) {
        throw new ConflictException(
          'Вы уже оставляли медиарецензию на данный релиз!',
        );
      }

      const review = await this.prisma.review.findUnique({
        where: {
          userId_releaseId: {
            userId: dto.userId,
            releaseId: dto.releaseId,
          },
        },
      });

      reviewId = review?.id ?? null;

      if (!reviewId) {
        throw new BadRequestException(
          'Чтобы добавить медиарецензию требуется оставить оценку/рецензию к релизу!',
        );
      }
    }

    if (await this.checkExistenceByUrl(dto.url)) {
      throw new ConflictException('Медиарецензия с таким URL уже существует!');
    }

    const created = await this.prisma.releaseMedia.create({
      data: {
        ...dto,
        reviewId: reviewId,
      },
    });

    return this.findById(created.id);
  }

  /**
   * Load a single raw release media entity by id.
   *
   * This returns the raw Prisma entity (including relations) and throws
   * an `EntityNotFoundException` when the entity does not exist.
   *
   * @param id string - release media id
   * @returns Promise<any> raw Prisma entity
   * @throws EntityNotFoundException when the entity is not found
   */
  async findOne(id: string) {
    const result = await this.prisma.releaseMedia.findUnique({
      where: { id },
      include: {
        releaseMediaStatus: true,
        releaseMediaType: true,
      },
    });

    if (!result) {
      throw new EntityNotFoundException('Медиа', 'id', id);
    }

    return result;
  }

  /**
   * Find a release media by id and return a normalized DTO.
   *
   * Uses the centralized raw query builder (`executeRawQuery`) to produce
   * a consistent response shape and throws `EntityNotFoundException` when
   * no item is returned.
   *
   * @param id string - release media id
   * @returns Promise<ReleaseMediaDto> normalized media DTO
   * @throws EntityNotFoundException when media not found
   */
  async findById(id: string): Promise<ReleaseMediaDto> {
    const releaseMedia = await this.executeRawQuery({ id });

    if (releaseMedia.result.items.length === 0) {
      throw new EntityNotFoundException('Медиа', 'id', id);
    }

    return releaseMedia.result.items[0];
  }

  /**
   * Search and return paginated release media according to the provided
   * `ReleaseMediaQueryDto` filters.
   *
   * Delegates filtering, aggregation and pagination to the raw SQL query
   * implemented in `executeRawQuery` to keep behaviour consistent across
   * complex joins and aggregates.
   *
   * @param query ReleaseMediaQueryDto - query filters and pagination
   * @returns Promise<ReleaseMediaResponseDto> with `items` and `meta`
   */
  async findAll(query: ReleaseMediaQueryDto): Promise<ReleaseMediaResponseDto> {
    const { result } = await this.executeRawQuery(query);

    return result;
  }

  /**
   * Update a release media entry.
   *
   * Behaviour:
   * - validates referenced entities (release, types, statuses)
   * - enforces permission rules when `userId` is provided (owner-only update)
   * - prevents URL collisions
   *
   * @param id string - media id to update
   * @param dto UpdateReleaseMediaDto - partial update payload
   * @param userId optional string - id of acting user (used for permission flow)
   * @returns Promise<ReleaseMediaDto> updated normalized DTO
   * @throws NoDataProvidedException when dto is empty
   * @throws EntityNotFoundException when target entity is missing
   * @throws InsufficientPermissionsException when a non-owner attempts a restricted update
   * @throws ConflictException when the new URL conflicts with an existing media
   */
  async update(
    id: string,
    dto: UpdateReleaseMediaDto,
    userId?: string,
  ): Promise<ReleaseMediaDto> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new NoDataProvidedException();
    }
    const releaseMedia = await this.findOne(id);

    if (dto.releaseId) {
      await this.releasesService.findOne(dto.releaseId);
    }

    if (dto.releaseMediaTypeId) {
      await this.releaseMediaTypesService.findById(dto.releaseMediaTypeId);
    }

    let newStatusId: string | undefined = dto.releaseMediaStatusId;

    if (newStatusId) {
      await this.releaseMediaStatusesService.findById(newStatusId);
    }

    if (userId) {
      if (releaseMedia.userId !== userId) {
        throw new InsufficientPermissionsException();
      }

      const newStatus = await this.releaseMediaStatusesService.findByStatus(
        ReleaseMediaStatusesEnum.PENDING,
      );

      newStatusId = newStatus.id;
    }

    if (dto.url) {
      if (await this.checkExistenceByUrl(dto.url)) {
        throw new ConflictException(
          'Медиарецензия с таким URL уже существует!',
        );
      }
    }

    const updated = await this.prisma.releaseMedia.update({
      where: { id },
      data: {
        ...dto,
        releaseMediaStatusId: newStatusId,
      },
    });

    return this.findById(updated.id);
  }

  /**
   * Remove a release media entry by id.
   *
   * Validates existence and enforces permission checks when `userId` is
   * provided. Deletes the DB record on success.
   *
   * @param id string - media id to delete
   * @param userId optional string - id of acting user (used to check ownership)
   */
  async remove(id: string, userId?: string) {
    const releaseMedia = await this.findOne(id);

    if (userId) {
      if (releaseMedia.userId !== userId) {
        throw new InsufficientPermissionsException();
      }
    }

    await this.prisma.releaseMedia.delete({ where: { id } });

    return;
  }

  /**
   * Check whether a media entry exists by URL (case-insensitive).
   *
   * @param url string - media URL to check
   * @returns Promise<boolean> true when a matching entry exists
   */
  private async checkExistenceByUrl(url: string): Promise<boolean> {
    const count = await this.prisma.releaseMedia.count({
      where: {
        url: { equals: url, mode: 'insensitive' },
      },
    });
    return count > 0;
  }

  /**
   * Execute the raw SQL query used to compose paginated and filtered
   * release media responses.
   *
   * The query returns a single JSON payload in column `result` with the
   * following shape: { items: [...], meta: { count } }.
   *
   * @param params filter/sort/pagination parameters
   * @returns Promise<ReleaseMediaRawQueryDto> raw query wrapper containing `result`
   */
  private async executeRawQuery(params: {
    id?: string;
    statusId?: string;
    typeId?: string;
    releaseId?: string;
    userId?: string;
    search?: string;
    order?: SortOrder;
    limit?: number;
    offset?: number;
  }): Promise<ReleaseMediaRawQueryDto> {
    const {
      id = null,
      statusId = null,
      typeId = null,
      releaseId = null,
      userId = null,
      search = null,
      order = null,
      limit = null,
      offset = null,
    } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${id}::text AS id_,
              ${statusId}::text AS status_id_,
              ${typeId}::text AS type_id_,
              ${releaseId}::text AS release_id_,
              ${userId}::text AS user_id_,
              ${search}::text AS search,
              ${order}::text AS sort_order,
              ${limit}::int AS limit_,
              ${offset}::int AS offset_
      ),

          filtered_media AS (
              SELECT rm.*
              FROM "Release_media" rm
                  JOIN params p ON TRUE
                  JOIN "Releases" r ON r.id = rm.release_id
                  LEFT JOIN "Users" u ON u. id = rm.user_id
              WHERE
                  (p.id_ IS NULL OR p.id_ = '' OR rm.id::text = p.id_)

                  AND (p.status_id_ IS NULL OR p. status_id_ = '' OR rm.release_media_status_id::text = p.status_id_)

                  AND (p.type_id_ IS NULL OR p.type_id_ = '' OR rm.release_media_type_id::text = p.type_id_)

                  AND (p.release_id_ IS NULL OR p.release_id_ = '' OR rm.release_id::text = p.release_id_)

                  AND (p.user_id_ IS NULL OR p.user_id_ = '' OR rm.user_id::text = p.user_id_)

                  AND (
                      p.search IS NULL OR p.search = ''
                          OR (
                              rm.title ILIKE '%' || p.search || '%'
                              OR r.title ILIKE '%' || p.search || '%'
                              OR (u.nickname IS NOT NULL AND u.nickname ILIKE '%' || p.search || '%')
                          )
                  )
          ),

          agg_stats AS (
              SELECT COUNT(*)::int AS total_count
              FROM filtered_media
          ),

          media_page AS (
              SELECT
                  jsonb_build_object(
                          'id', rm.id,
                          'title', rm. title,
                          'url', rm.url,
                          'createdAt', rm.created_at,
                          'status', jsonb_build_object(
                                  'id', rms.id,
                                  'status', rms.status
                                  ),
                          'type', jsonb_build_object(
                                  'id', rmt.id,
                                  'type', rmt.type
                                  ),
                          'user', CASE
                                      WHEN u.id IS NOT NULL THEN jsonb_build_object(
                                              'id', u.id,
                                              'nickname', u.nickname,
                                              'avatar', up.avatar,
                                              'point', up.points,
                                              'rank', tul.rank
                                              )
                                      ELSE NULL
                                  END,
                          'release', jsonb_build_object(
                                  'id', r.id,
                                  'title', r.title,
                                  'img', r.img
                                  ),
                          'review', CASE
                                          WHEN rev.id IS NOT NULL THEN jsonb_build_object(
                                                  'total', rev.total,
                                                'rhymes', rev.rhymes,
                                                'structure', rev.structure,
                                                'realization', rev.realization,
                                                'individuality', rev. individuality,
                                                'atmosphere', rev.atmosphere
                                              )
                                          ELSE NULL
                                  END,
                          'userFavMedia', COALESCE(ufm_arr.userFavMedia, '[]'::jsonb),
                          'authorFavMedia', COALESCE(afm_arr.authorFavMedia, '[]'::jsonb)
                  ) AS media_json,
                  rm.created_at AS sort_value
              FROM filtered_media rm
                  JOIN params p ON TRUE
                  JOIN "Release_media_statuses" rms ON rms.id = rm. release_media_status_id
                  JOIN "Release_media_types" rmt ON rmt.id = rm.release_media_type_id
                  JOIN "Releases" r ON r.id = rm.release_id
                  LEFT JOIN "Users" u ON u.id = rm.user_id
                  LEFT JOIN "User_profiles" up ON up.user_id = u.id
                  LEFT JOIN "Top_users_leaderboard" tul ON tul.user_id = u.id
                  LEFT JOIN "Reviews" rev ON rev.id = rm.review_id

                  LEFT JOIN LATERAL (
                      SELECT COALESCE(
                                  JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
                                          'userId', ufm.user_id,
                                          'mediaId', ufm.media_id
                                  )) FILTER (WHERE ufm.user_id IS NOT NULL),
                                  '[]'::jsonb
                      ) AS userFavMedia
                      FROM "User_fav_media" ufm
                      WHERE ufm.media_id = rm. id
                  ) ufm_arr ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT COALESCE(
                                  JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
                                          'userId', ufm2.user_id,
                                          'avatar', up2.avatar,
                                          'nickname', u2.nickname,
                                          'mediaId', rm. id
                                  )) FILTER (WHERE ufm2.user_id IS NOT NULL),
                                  '[]'::jsonb
                      ) AS authorFavMedia
                      FROM "User_fav_media" ufm2
                          JOIN "Users" u2 ON u2.id = ufm2.user_id
                          LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
                      WHERE ufm2.media_id = rm.id
                          AND EXISTS (
                              SELECT 1
                              FROM "Registered_authors" ra
                              WHERE ra.user_id = ufm2. user_id
                                  AND ra.author_id IN (
                                      SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = r.id
                                      UNION
                                      SELECT ra3.author_id FROM "Release_artists" ra3 WHERE ra3.release_id = r.id
                                      UNION
                                      SELECT rd3.author_id FROM "Release_designers" rd3 WHERE rd3.release_id = r.id
                              )
                          )
                  ) afm_arr ON TRUE

              ORDER BY
                  CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'asc' THEN rm.created_at END ASC NULLS LAST,
                  CASE WHEN lower(COALESCE(p.sort_order, 'desc')) = 'desc' THEN rm.created_at END DESC NULLS LAST,
                  rm.id DESC

              LIMIT (SELECT limit_ FROM params)
              OFFSET (SELECT offset_ FROM params)
          )

      SELECT
          jsonb_build_object(
                  'items', items. items,
                  'meta', jsonb_build_object('count', agg.total_count)
          ) AS result
      FROM (
          SELECT COALESCE(
                      JSONB_AGG(media_json) FILTER (WHERE media_json IS NOT NULL),
                      '[]'::jsonb
          ) AS items
          FROM media_page
      ) items
          CROSS JOIN agg_stats agg;
    `;

    const [response] =
      await this.prisma.$queryRaw<ReleaseMediaRawQueryArrayDto>(sql);

    return response;
  }
}
