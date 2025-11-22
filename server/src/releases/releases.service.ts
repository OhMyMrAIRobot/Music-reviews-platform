import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { FileService } from 'src/file/files.service';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { SortOrder } from 'src/shared/types/sort-order.type';
import { CreateReleaseRequestDto } from './dto/request/create-release.request.dto';
import { ReleasesQueryDto } from './dto/request/query/releases.query.dto';
import { UpdateReleaseRequestDto } from './dto/request/update-release.request.dto';
import { ReleaseDto } from './dto/response/release.dto';
import { ReleasesResponseDto } from './dto/response/releases.response.dto';
import { ReleaseRawQueryArrayResponseDto } from './types/release-raw-query-response.dto';
import { ReleaseSortFieldsEnum } from './types/release-sort-fields.enum';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseTypesService: ReleaseTypesService,
    private readonly authorsService: AuthorsService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Create a new release.
   *
   * Validations:
   * - ensures `releaseTypeId` exists
   * - ensures all referenced authors exist
   *
   * Side-effects:
   * - stores uploaded `cover` via `FileService` and removes it on errors
   *
   * @param dto CreateReleaseRequestDto - payload for creation
   * @param cover optional uploaded cover file (Multer)
   * @returns created ReleaseDto
   * @throws BadRequestException when referenced entities are missing
   * @throws InternalServerErrorException on storage/DB errors
   */
  async create(
    dto: CreateReleaseRequestDto,
    cover?: Express.Multer.File,
  ): Promise<ReleaseDto> {
    await this.releaseTypesService.findOne(dto.releaseTypeId);

    const allAuthorIds = [
      ...(dto.releaseArtists ?? []),
      ...(dto.releaseProducers ?? []),
      ...(dto.releaseDesigners ?? []),
    ];

    const uniqueAuthorIds = [...new Set(allAuthorIds)];
    const isAuthorsExist =
      await this.authorsService.checkAuthorsExist(uniqueAuthorIds);

    if (!isAuthorsExist) {
      throw new BadRequestException(
        'Один или несколько указанных авторов не существуют',
      );
    }

    const artistConnections = dto.releaseArtists?.map((id) => ({
      author: {
        connect: { id },
      },
    }));

    const producerConnections = dto.releaseProducers?.map((id) => ({
      author: {
        connect: { id },
      },
    }));

    const designerConnections = dto.releaseDesigners?.map((id) => ({
      author: {
        connect: { id },
      },
    }));

    const coverImg = cover
      ? await this.fileService.saveFile(cover, 'releases')
      : '';

    try {
      const created = await this.prisma.release.create({
        data: {
          title: dto.title,
          publishDate: dto.publishDate,
          img: coverImg,
          releaseTypeId: dto.releaseTypeId,
          releaseArtist: {
            create: artistConnections,
          },
          releaseProducer: {
            create: producerConnections,
          },
          releaseDesigner: {
            create: designerConnections,
          },
        },
      });

      return this.findById(created.id);
    } catch {
      if (coverImg) {
        await this.fileService.deleteFile(coverImg);
      }
      throw new InternalServerErrorException('Не удалось создать релиз!');
    }
  }

  /**
   * Load single release by id and return normalized DTO.
   *
   * Implementation uses `executeRawQuery` which returns a consistent JSON
   * payload containing `items` and `meta` keys. We read the first item
   * when present and throw `EntityNotFoundException` otherwise.
   *
   * @param id release id
   * @returns ReleaseDto
   * @throws EntityNotFoundException when release not found
   */
  async findById(id: string): Promise<ReleaseDto> {
    const response = await this.executeRawQuery({ id });

    if (response.result.items.length === 0) {
      throw new EntityNotFoundException('Релиз', 'id', id);
    }

    return response.result.items[0];
  }

  /**
   * Search and list releases according to `ReleasesQueryDto`.
   *
   * Delegates filtering, aggregation and sorting to the raw SQL query to
   * keep behaviour consistent and performant for complex joins/aggregates.
   *
   * @param query query DTO with filters, pagination and sorting
   * @returns ReleasesResponseDto with `items` and `meta`
   */
  async findAll(query: ReleasesQueryDto): Promise<ReleasesResponseDto> {
    const response = await this.executeRawQuery({
      authorId: query.authorId,
      releaseTypeId: query.typeId,
      title: query.search,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      last24Only: query.last24h,
      publishYear: query.year,
      publishMonth: query.month,
      limit: query.limit,
      offset: query.offset,
    });

    return response.result;
  }

  /**
   * Update a release by id.
   *
   * Behaviour:
   * - validates existence and referenced entities
   * - uploads new cover and deletes previous file on success
   * - wraps relational updates in a transaction
   *
   * @param id release id
   * @param dto partial update DTO
   * @param cover optional new cover file
   * @returns updated ReleaseDto
   */
  async update(
    id: string,
    dto: UpdateReleaseRequestDto,
    cover?: Express.Multer.File,
  ): Promise<ReleaseDto> {
    if ((!dto || Object.keys(dto).length === 0) && !cover) {
      throw new NoDataProvidedException();
    }

    const release = await this.findOne(id);

    if (dto.releaseTypeId) {
      await this.releaseTypesService.findOne(dto.releaseTypeId);
    }

    const allAuthorIds = [
      ...(dto.releaseArtists ?? []),
      ...(dto.releaseProducers ?? []),
      ...(dto.releaseDesigners ?? []),
    ];

    const uniqueAuthorIds = [...new Set(allAuthorIds)];
    const isAuthorsExist =
      await this.authorsService.checkAuthorsExist(uniqueAuthorIds);

    if (!isAuthorsExist) {
      throw new BadRequestException(
        'Один или несколько указанных авторов не существуют',
      );
    }
    let newImg: string | undefined;
    try {
      if (cover && dto.clearCover !== true) {
        newImg = await this.fileService.saveFile(cover, 'releases');
      }

      const updatedRelease = await this.prisma.$transaction(async (prisma) => {
        const data: Prisma.ReleaseUpdateInput = {
          ...(dto.title && { title: dto.title }),
          ...(dto.publishDate && {
            publishDate: dto.publishDate,
          }),
          img: dto.clearCover ? '' : newImg,
          ...(dto.releaseTypeId && {
            ReleaseType: { connect: { id: dto.releaseTypeId } },
          }),
        };

        if (dto.releaseArtists !== undefined) {
          await prisma.releaseArtist.deleteMany({
            where: { releaseId: id },
          });

          data.releaseArtist = {
            create: dto.releaseArtists.map((authorId) => ({
              author: { connect: { id: authorId } },
            })),
          };
        }

        if (dto.releaseProducers !== undefined) {
          await prisma.releaseProducer.deleteMany({
            where: { releaseId: id },
          });

          data.releaseProducer = {
            create: dto.releaseProducers.map((authorId) => ({
              author: { connect: { id: authorId } },
            })),
          };
        }

        if (dto.releaseDesigners !== undefined) {
          await prisma.releaseDesigner.deleteMany({
            where: { releaseId: id },
          });

          data.releaseDesigner = {
            create: dto.releaseDesigners.map((authorId) => ({
              author: { connect: { id: authorId } },
            })),
          };
        }

        const updated = await prisma.release.update({
          where: { id },
          data,
        });

        return updated;
      });

      if ((cover || dto.clearCover) && release.img !== '') {
        await this.fileService.deleteFile('releases/' + release.img);
      }

      return this.findById(updatedRelease.id);
    } catch {
      if (newImg) {
        await this.fileService.deleteFile('releases/' + newImg);
      }
      throw new InternalServerErrorException('Не удалось обновить релиз!');
    }
  }

  /**
   * Remove a release by id and delete associated cover file.
   *
   * Performs an existence check then deletes the DB record followed by
   * file cleanup for the release image.
   *
   * @param id release id
   */
  async remove(id: string) {
    await this.findOne(id);

    const release = await this.prisma.release.delete({
      where: { id },
    });

    if (release.img !== '') {
      await this.fileService.deleteFile('releases/' + release.img);
    }

    return;
  }

  /**
   * Internal helper that ensures a release exists and returns the raw
   * Prisma entity used for validation in update/remove flows.
   *
   * @param id release id
   * @throws EntityNotFoundException when missing
   */
  async findOne(id: string) {
    const existingRelease = await this.prisma.release.findUnique({
      where: { id },
      include: {
        releaseArtist: true,
        releaseDesigner: true,
        releaseProducer: true,
        releaseType: true,
      },
    });

    if (!existingRelease) {
      throw new EntityNotFoundException('Релиз', 'id', `${id}`);
    }

    return existingRelease;
  }

  /**
   * Execute the centralized raw SQL query built for releases listing.
   *
   * The query returns a single JSON payload in column `result` with the
   * following shape: { items: [...], meta: { count, minPublishYear, maxPublishYear } }.
   *
   * @param params filter/sort/pagination parameters
   * @returns raw query wrapper object containing `result` as described above
   */
  private async executeRawQuery(params: {
    id?: string;
    authorId?: string;
    releaseTypeId?: string;
    title?: string;
    publishYear?: number;
    publishMonth?: number;
    sortField?: ReleaseSortFieldsEnum;
    sortOrder?: SortOrder;
    last24Only?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const {
      id = null,
      authorId = null,
      releaseTypeId = null,
      title = null,
      publishYear = null,
      publishMonth = null,
      sortField = null,
      sortOrder = null,
      limit = null,
      last24Only = null,
      offset = 0,
    } = params;

    if (id !== null) await this.findOne(id);
    if (authorId !== null) await this.authorsService.findOne(authorId);
    if (releaseTypeId !== null)
      await this.releaseTypesService.findOne(releaseTypeId);

    // ----------- START QUERY -----------
    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${id}::text AS id,
              ${authorId}::text AS author_id,
              ${releaseTypeId}::text AS release_type_id,
              ${title}::text AS title,
              ${publishYear}::int AS publish_year,
              ${publishMonth}::int AS publish_month,
              ${sortField}::text AS sort_field,
              ${sortOrder}::text AS sort_order,
              ${last24Only}::boolean AS last24_only,
              ${limit}::int AS limit_,
              ${offset}::int AS offset_
      ),
          filtered_releases AS (
              SELECT r.*
              FROM "Releases" r
              JOIN params p ON TRUE
              WHERE (p.id IS NULL OR r.id = p.id)
                  AND (p.author_id IS NULL
                  OR EXISTS (
                      SELECT 1
                      FROM "Release_artists" ra
                      WHERE ra.release_id = r.id
                          AND ra.author_id = p.author_id)
                  OR EXISTS (
                      SELECT 1
                      FROM "Release_producers" rp
                      WHERE rp.release_id = r.id
                          AND rp.author_id = p.author_id)
                  OR EXISTS (
                      SELECT 1
                      FROM "Release_designers" rd
                      WHERE rd.release_id = r.id
                          AND rd.author_id = p.author_id
                  ))
                  AND (p.title IS NULL OR r.title ILIKE '%' || p.title || '%')
                  AND (p.release_type_id IS NULL OR r.release_type_id = p.release_type_id)
                  AND (p.publish_year IS NULL OR EXTRACT(YEAR FROM r.publish_date)::int = p.publish_year)
                  AND (p.publish_month IS NULL OR EXTRACT(MONTH FROM r.publish_date)::int = p.publish_month)
                  AND (p.last24_only IS NULL OR p.last24_only = FALSE
                      OR EXISTS (
                          SELECT 1
                          FROM "Reviews" rev24
                          WHERE rev24.release_id = r.id
                              AND rev24.created_at >= NOW() - INTERVAL '24 hours'
                      ))
          ),

          agg_stats AS (
              SELECT
                  COUNT(*) AS total_count,
                  MIN(EXTRACT(YEAR FROM publish_date))::int AS min_publish_year,
                  MAX(EXTRACT(YEAR FROM publish_date))::int AS max_publish_year
              FROM filtered_releases
          ),

          last24_reviews AS (
              SELECT
                  release_id,
                  COUNT(*) AS reviews_count_24h,
                  COUNT(*) FILTER (WHERE text IS NOT NULL) AS reviews_with_text_count_24h,
                  COUNT(*) FILTER (WHERE text IS NULL) AS reviews_without_text_count_24h
              FROM "Reviews"
              WHERE created_at >= NOW() - INTERVAL '24 hours'
              GROUP BY release_id
          ),

          releases_page AS (
              SELECT
                  jsonb_build_object(
                          'id', r.id,
                          'title', r.title,
                          'img', r.img,
                          'publishDate', r.publish_date,
                          'createdAt', r.created_at,
                          'releaseType', jsonb_build_object('id', rt.id, 'type', rt.type),
                          'authors', jsonb_build_object(
                              'artists', COALESCE(arts.artists, '[]'::jsonb),
                              'producers', COALESCE(prods.producers, '[]'::jsonb),
                              'designers', COALESCE(desg.designers, '[]'::jsonb)),
                          'userFavRelease', COALESCE(ufr.userFavRelease, '[]'::jsonb),
                          'ratings', COALESCE(ratings.ratings, jsonb_build_object('total', '[]'::jsonb, 'details', '[]'::jsonb)),
                          'reviewsInfo', COALESCE(revinfo.reviewsInfo, jsonb_build_object('withText', 0, 'withoutText', 0)),
                          'hasAuthorComments', EXISTS (
                              SELECT 1
                              FROM "Author_comments" ac
                                  JOIN "Registered_authors" ra ON ra.user_id = ac.user_id
                              WHERE ac.release_id = r.id
                                  AND ra.author_id IN (
                                      SELECT rp.author_id
                                      FROM "Release_producers" rp
                                      WHERE rp.release_id = r.id
                                      UNION
                                      SELECT ar.author_id
                                      FROM "Release_artists" ar
                                      WHERE ar.release_id = r.id
                                      UNION
                                      SELECT rd.author_id
                                      FROM "Release_designers" rd
                                      WHERE rd.release_id = r.id
                              )),
                          'hasAuthorLikes', (
                              EXISTS (
                                  SELECT 1
                                  FROM "User_fav_reviews" ufr2
                                      JOIN "Reviews" r2 ON r2.id = ufr2.review_id
                                      JOIN "Registered_authors" ra2 ON ra2.user_id = ufr2.user_id
                                  WHERE r2.release_id = r.id
                                      AND ra2.author_id IN (
                                          SELECT rp.author_id
                                          FROM "Release_producers" rp
                                          WHERE rp.release_id = r.id
                                          UNION
                                          SELECT ar.author_id
                                          FROM "Release_artists" ar
                                          WHERE ar.release_id = r.id
                                          UNION
                                          SELECT rd.author_id
                                          FROM "Release_designers" rd
                                          WHERE rd.release_id = r.id
                                      )
                              )
                              OR EXISTS (
                                  SELECT 1
                                  FROM "User_fav_media" ufm
                                      JOIN "Release_media" rm ON rm.id = ufm.media_id
                                      JOIN "Registered_authors" ra3 ON ra3.user_id = ufm.user_id
                                  WHERE rm.release_id = r.id
                                      AND ra3.author_id IN (
                                          SELECT rp.author_id
                                          FROM "Release_producers" rp
                                          WHERE rp.release_id = r.id
                                          UNION
                                          SELECT ar.author_id
                                          FROM "Release_artists" ar
                                          WHERE ar.release_id = r.id
                                          UNION
                                          SELECT rd.author_id
                                          FROM "Release_designers" rd
                                          WHERE rd.release_id = r.id
                                      )
                              )
                          ),
                          'nominationTypes', COALESCE(nom.nominationTypes, '[]'::jsonb)) AS release_json,
                          COALESCE(lr.reviews_count_24h, 0) AS reviews24_count

              FROM filtered_releases r
                  JOIN params p ON TRUE
                  LEFT JOIN last24_reviews lr ON lr.release_id = r.id
                  LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id

                  LEFT JOIN LATERAL (
                      SELECT JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name, 'img', a.avatar_img))
                      FILTER (WHERE a.id IS NOT NULL) AS artists
                      FROM "Release_artists" ra
                          JOIN "Authors" a ON a.id = ra.author_id
                      WHERE ra.release_id = r.id
                  ) arts ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name, 'img', a.avatar_img))
                      FILTER (WHERE a.id IS NOT NULL) AS producers
                      FROM "Release_producers" rp
                          JOIN "Authors" a ON a.id = rp.author_id
                      WHERE rp.release_id = r.id
                  ) prods ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name, 'img', a.avatar_img))
                      FILTER (WHERE a.id IS NOT NULL) AS designers
                      FROM "Release_designers" rd
                          JOIN "Authors" a ON a.id = rd.author_id
                      WHERE rd.release_id = r.id
                  ) desg ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT COALESCE(JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('userId', ufr.user_id, 'releaseId', ufr.release_id))
                      FILTER (WHERE ufr.user_id IS NOT NULL), '[]'::jsonb) AS userFavRelease
                      FROM "User_fav_releases" ufr
                      WHERE ufr.release_id = r.id
                  ) ufr ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT
                          jsonb_build_object(
                                  'total', COALESCE(
                                          JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('type', rrt.type, 'total', rr.total))
                                              FILTER (WHERE rrt.type IS NOT NULL OR rr.total IS NOT NULL),
                                          '[]'::jsonb
                                  ),
                                  'details', COALESCE(
                                      JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
                                          'type', rrt.type,
                                          'details', JSONB_BUILD_OBJECT(
                                                  'rhymes', rrd.rhymes,
                                                  'structure', rrd.structure,
                                                  'atmosphere', rrd.atmosphere,
                                                  'realization', rrd.realization,
                                                  'individuality', rrd.individuality)))
                                          FILTER (WHERE rrt.type IS NOT NULL
                                              OR rrd.rhymes IS NOT NULL
                                              OR rrd.structure IS NOT NULL
                                              OR rrd.atmosphere IS NOT NULL
                                              OR rrd.realization IS NOT NULL
                                              OR rrd.individuality IS NOT NULL),
                                      '[]'::jsonb
                                  )) AS ratings
                      FROM "Release_ratings" rr
                          LEFT JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                          LEFT JOIN "Release_rating_details" rrd ON rr.id = rrd.release_rating_id
                      WHERE
                          rr.release_id = r.id
                  ) ratings ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT
                          jsonb_build_object('withText', COALESCE((COUNT(*) FILTER (WHERE rev.text IS NOT NULL)), 0), 'withoutText', COALESCE((COUNT(*) FILTER (WHERE rev.text IS NULL)), 0)) AS reviewsInfo,
                          COALESCE((COUNT(*) FILTER (WHERE rev.text IS NOT NULL)), 0) AS with_text_count,
                          COALESCE((COUNT(*) FILTER (WHERE rev.text IS NULL)), 0) AS without_text_count
                      FROM
                          "Reviews" rev
                      WHERE
                          rev.release_id = r.id) revinfo ON TRUE
                      LEFT JOIN LATERAL (
                      SELECT
                          COALESCE(JSONB_AGG(nr.nomination_type ORDER BY nr.nomination_type), '[]'::jsonb) AS nominationTypes
                      FROM (
                          SELECT DISTINCT rres.nomination_type
                          FROM "Nomination_results" rres
                              JOIN (
                                  SELECT
                                      nomination_type_id,
                                      year,
                                      month,
                                      SUM(votes) AS total_votes
                                  FROM "Nomination_results"
                                  GROUP BY
                                      nomination_type_id,
                                      year,
                                      month
                              ) bt ON bt.nomination_type_id = rres.nomination_type_id
                                  AND bt.year = rres.year
                                  AND bt.month = rres.month
                          WHERE rres.entity_kind = 'release'
                              AND rres.release_id = r.id
                              AND bt.total_votes > 0
                              AND (rres.votes::numeric / bt.total_votes::numeric) > 0.2) nr
                  ) nom ON TRUE

                  LEFT JOIN LATERAL (
                      SELECT
                          CASE
                              WHEN p.sort_field = 'published' THEN
                                  EXTRACT(EPOCH FROM r.publish_date)::bigint
                              WHEN p.sort_field = 'withTextCount' THEN
                                  COALESCE(revinfo.with_text_count, 0)::int
                              WHEN p.sort_field = 'withoutTextCount' THEN
                                  COALESCE(revinfo.without_text_count, 0)::int
                              WHEN p.sort_field = 'mediaRating' THEN
                                  (
                                      SELECT COALESCE(rr.total, 0)::int
                                      FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                                      WHERE rr.release_id = r.id
                                          AND rrt.type = 'Оценка медиа'
                                      ORDER BY rr.id
                                      LIMIT 1
                                  )
                              WHEN p.sort_field = 'withoutTextRating' THEN
                                  (
                                      SELECT COALESCE(rr.total, 0)::int
                                      FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                                      WHERE rr.release_id = r.id
                                          AND rrt.type = 'Оценка без рецензии'
                                      ORDER BY rr.id
                                      LIMIT 1
                                  )
                              WHEN p.sort_field = 'withTextRating' THEN
                                  (
                                      SELECT COALESCE(rr.total, 0)::int
                                      FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                                      WHERE
                                          rr.release_id = r.id
                                              AND rrt.type = 'Оценка с рецензией'
                                      ORDER BY rr.id
                                      LIMIT 1
                                  )
                              WHEN p.sort_field = 'allRating' THEN
                                  (
                                      SELECT COALESCE(SUM(rr.total), 0)::int
                                      FROM "Release_ratings" rr
                                      WHERE rr.release_id = r.id
                                  )
                              WHEN p.sort_field = 'totalCount' THEN
                                  COALESCE(lr.reviews_count_24h, 0)::int
                              ELSE NULL
                          END AS sort_value
                  ) sorter ON TRUE

              ORDER BY
                  CASE
                      WHEN lower(COALESCE(p.sort_order, 'desc')) = 'asc' THEN sorter.sort_value
                  END ASC NULLS LAST,

                  CASE
                      WHEN lower(COALESCE(p.sort_order, 'desc')) = 'desc' THEN sorter.sort_value
                  END DESC NULLS LAST,
                  r.id DESC

              LIMIT (
                  SELECT limit_
                  FROM params
              )

              OFFSET (
                  SELECT offset_
                  FROM params
              )
          )
      SELECT
          jsonb_build_object(
                  'items', items.items,
                  'meta', jsonb_build_object(
                          'count', agg.total_count,
                          'minPublishYear', agg.min_publish_year,
                          'maxPublishYear', agg.max_publish_year
                      )
          ) as result
      FROM (
              SELECT COALESCE(
                          JSONB_AGG(
                              release_json ORDER BY (release_json->>'id')
                          ) FILTER (WHERE release_json IS NOT NULL),
                          '[]'::jsonb
              ) AS items
              FROM releases_page
      ) items
      CROSS JOIN agg_stats agg
    `;
    // ----------- END QUERY -----------

    const [response] =
      await this.prisma.$queryRaw<ReleaseRawQueryArrayResponseDto>(sql);

    return response;
  }
}
