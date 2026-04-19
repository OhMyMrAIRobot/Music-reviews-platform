import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Author, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesService } from 'src/author-types/author-types.service';
import { FileService } from 'src/file/files.service';
import { DuplicateFieldException } from 'src/shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorRequestDto } from './dto/request/create-author.request.dto';
import { AuthorsQueryDto } from './dto/request/query/authors.query.dto';
import { UpdateAuthorRequestDto } from './dto/request/update-author.request.dto';
import { AuthorDto } from './dto/response/author.dto';
import { AuthorsResponseDto } from './dto/response/authors.response.dto';
import {
  AuthorsRawQueryArrayDto,
  AuthorsRawQueryDto,
} from './types/authors-raw-query.dto';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorTypesService: AuthorTypesService,
    private readonly fileService: FileService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new author record.
   *
   * Steps:
   * - Validate that all provided author type ids exist.
   * - Ensure there is no existing author with the same name (case-insensitive).
   * - Save optional avatar and cover files via `FileService`.
   * - Persist the author and its author-type connections in the database.
   * - In case of any failure, uploaded files are cleaned up and an
   *   `InternalServerErrorException` is thrown.
   *
   * @param dto Create payload containing `name` and `types`.
   * @param avatar Optional avatar file (first file from multipart upload).
   * @param cover Optional cover file (first file from multipart upload).
   * @returns The created `AuthorDto` (serialized representation).
   */
  async create(
    dto: CreateAuthorRequestDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<AuthorDto> {
    const typesExist = await this.authorTypesService.checkTypesExist(dto.types);

    if (!typesExist) {
      throw new BadRequestException(
        'Один или несколько указанных типов не существуют',
      );
    }

    const existingAuthor = await this.findByName(dto.name);

    if (existingAuthor) {
      throw new DuplicateFieldException(
        'Автор',
        'именем',
        `${existingAuthor.name}`,
      );
    }

    const authorTypeConnections = dto.types.map((typeId) => ({
      authorType: {
        connect: { id: typeId },
      },
    }));

    let avatarImg = '';
    let coverImg = '';

    try {
      avatarImg = avatar
        ? await this.fileService.saveFile(avatar, 'authors', 'avatars')
        : '';

      coverImg = cover
        ? await this.fileService.saveFile(cover, 'authors', 'covers')
        : '';

      const created = await this.prisma.author.create({
        data: {
          name: dto.name,
          types: {
            create: authorTypeConnections,
          },
          avatarImg,
          coverImg,
        },
        include: {
          types: {
            include: {
              authorType: true,
            },
          },
        },
      });

      return this.findById(created.id);
    } catch {
      if (avatarImg !== '')
        await this.fileService.deleteFile(`authors/avatars/${avatarImg}`);

      if (coverImg !== '')
        await this.fileService.deleteFile(`authors/covers/${coverImg}`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Retrieve a raw `Author` record by id.
   *
   * Throws `EntityNotFoundException` when the entity does not exist.
   * This method is used internally when we need the Prisma model rather
   * than the serialized DTO.
   *
   * @param id Author id
   * @returns Prisma `Author` model instance
   */
  async findOne(id: string): Promise<Author> {
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      throw new EntityNotFoundException('Автор', 'id', `${id}`);
    }

    return existingAuthor;
  }

  /**
   * Find a serialized author by id.
   *
   * This method delegates to `executeRawQuery` to return the full
   * `AuthorDto` structure (including nested arrays and aggregates). If no
   * author is found, an `EntityNotFoundException` is thrown.
   *
   * @param id Author id
   * @returns `AuthorDto` serialized object
   */
  async findById(id: string): Promise<AuthorDto> {
    const { result } = await this.executeRawQuery({ id });

    if (result.items.length === 0) {
      throw new EntityNotFoundException('Автор', 'id', id);
    }

    return result.items[0];
  }

  /**
   * List authors with optional filtering and pagination.
   *
   * Supported filters: `typeId`, `search`, `onlyRegistered`, `userId`.
   * This method validates referenced `typeId` and `userId` entities before
   * running the composed raw SQL query which returns aggregated data.
   *
   * @param query Query parameters controlling filtering and pagination
   * @returns Paginated `AuthorsResponseDto` with `items` and `meta`.
   */
  async findAll(query: AuthorsQueryDto): Promise<AuthorsResponseDto> {
    if (query.typeId) await this.authorTypesService.findOne(query.typeId);
    if (query.userId) await this.usersService.findOne(query.userId);

    const { result } = await this.executeRawQuery(query);

    return result;
  }

  /**
   * Update an existing author.
   *
   * Behaviour and checks:
   * - If no data and no files are provided, throws `NoDataProvidedException`.
   * - Validates provided `types` and `name` uniqueness similarly to create.
   * - Saves new avatar/cover files when provided (unless clear flags are set).
   * - Performs updates inside a transaction and replaces author->type links
   *   when `types` are supplied.
   * - Deletes replaced media files after successful update; cleans up
   *   newly uploaded files on error.
   *
   * @param id Author id to update
   * @param dto Partial update payload and clear flags
   * @param avatar Optional new avatar file
   * @param cover Optional new cover file
   * @returns Updated `AuthorDto` serialized object
   */
  async update(
    id: string,
    dto: UpdateAuthorRequestDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<AuthorDto> {
    if (Object.keys(dto).length === 0 && !avatar && !cover) {
      throw new NoDataProvidedException();
    }

    const author = await this.findOne(id);

    if (dto.types) {
      const typesExist = await this.authorTypesService.checkTypesExist(
        dto.types,
      );

      if (!typesExist) {
        throw new BadRequestException(
          'Один или несколько указанных типов не существуют',
        );
      }
    }

    if (dto.name) {
      const existingAuthor = await this.findByName(dto.name);

      if (existingAuthor) {
        throw new DuplicateFieldException(
          'Автор',
          'именем',
          `${existingAuthor.name}`,
        );
      }
    }

    let newAvatarPath: string | undefined = undefined;
    let newCoverPath: string | undefined = undefined;

    try {
      if (avatar && dto.clearAvatar !== true) {
        newAvatarPath = await this.fileService.saveFile(
          avatar,
          'authors',
          'avatars',
        );
      }

      if (cover && dto.clearCover !== true) {
        newCoverPath = await this.fileService.saveFile(
          cover,
          'authors',
          'covers',
        );
      }

      const updated = await this.prisma.$transaction(async (prisma) => {
        const data: Prisma.AuthorUpdateInput = {
          name: dto.name,
          avatarImg: dto.clearAvatar === true ? '' : newAvatarPath,
          coverImg: dto.clearCover === true ? '' : newCoverPath,
        };

        if (dto.types) {
          await prisma.authorOnType.deleteMany({
            where: { authorId: id },
          });

          data.types = {
            create: dto.types.map((typeId) => ({
              authorType: { connect: { id: typeId } },
            })),
          };
        }

        return prisma.author.update({
          where: { id },
          data,
          include: {
            types: {
              include: {
                authorType: true,
              },
            },
          },
        });
      });

      if ((newAvatarPath || dto.clearAvatar) && author.avatarImg !== '') {
        await this.fileService.deleteFile(
          `authors/avatars/${author.avatarImg}`,
        );
      }

      if ((newCoverPath || dto.clearCover) && author.coverImg !== '') {
        await this.fileService.deleteFile(`authors/covers/${author.coverImg}`);
      }

      return this.findById(updated.id);
    } catch {
      if (newAvatarPath) {
        await this.fileService.deleteFile(`authors/avatars/${newAvatarPath}`);
      }
      if (newCoverPath) {
        await this.fileService.deleteFile(`authors/covers/${newCoverPath}`);
      }

      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove an author by id.
   *
   * Ensures the author exists, deletes the database record and removes any
   * stored avatar/cover files. Returns nothing on success.
   *
   * @param id Author id to remove
   */
  async remove(id: string) {
    await this.findOne(id);
    const author = await this.prisma.author.delete({
      where: { id },
    });

    if (author.avatarImg !== '') {
      await this.fileService.deleteFile('authors/avatars/' + author.avatarImg);
    }
    if (author.coverImg !== '') {
      await this.fileService.deleteFile('authors/covers/' + author.coverImg);
    }

    return;
  }

  /**
   * Check that every id in `authorIds` corresponds to an existing author.
   *
   * Returns `true` when the given array is empty (no authors to check).
   * Useful for validating foreign keys before bulk operations.
   *
   * @param authorIds Array of author ids to validate
   * @returns `true` when all ids exist, otherwise `false`
   */
  async checkAuthorsExist(authorIds: string[]): Promise<boolean> {
    if (authorIds.length === 0) return true;
    const existingAuthors = await this.prisma.author.findMany({
      where: {
        id: { in: authorIds },
      },
      select: { id: true },
    });
    return existingAuthors.length === authorIds.length;
  }

  /**
   * Find an author by name (case-insensitive).
   *
   * Returns the Prisma `Author` model or `null` when none exists. Used to
   * enforce unique author names on create/update.
   */
  private async findByName(name: string): Promise<Author | null> {
    return this.prisma.author.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  /**
   * Execute the complex raw SQL query that builds the serialized authors
   * response object.
   *
   * The SQL returns a single row containing a JSON `result` object with
   * `items` and `meta`. The query supports an `id` filter for single
   * entity retrieval as well as pagination, search and user-specific
   * tailoring.
   *
   * @param params Filtering and pagination parameters
   * @returns Object shaped as `{ result: { items, meta } }`
   */
  private async executeRawQuery(params: {
    id?: string;
    typeId?: string;
    onlyRegistered?: boolean;
    search?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuthorsRawQueryDto> {
    const {
      id = null,
      typeId = null,
      onlyRegistered = null,
      search = null,
      userId = null,
      limit = null,
      offset = null,
    } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${id}::text AS id_,
              ${typeId}::text AS type_id_,
              ${onlyRegistered}::boolean AS is_registered,
              ${search}::text AS search,
              ${userId}::text AS user_id,
              ${limit}::int AS limit_,
              ${offset}::int AS offset_
      ),

          all_release_types AS (
              SELECT type AS release_type
              FROM "Release_types"
          ),

          authors_with_types AS (
              SELECT a.id AS author_id, rt.release_type
              FROM "Authors" a
                  CROSS JOIN all_release_types rt
          ),

          author_releases AS (
              SELECT DISTINCT a.id AS author_id, r.id AS release_id, rt.type AS release_type
              FROM "Authors" a
                  LEFT JOIN "Release_producers" rp ON a.id = rp.author_id
                  LEFT JOIN "Releases" r ON rp.release_id = r.id
                  LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
              WHERE r.id IS NOT NULL AND rt.type IS NOT NULL

              UNION

              SELECT DISTINCT a.id AS author_id, r.id AS release_id, rt.type AS release_type
              FROM "Authors" a
                  LEFT JOIN "Release_artists" ra ON a.id = ra.author_id
                  LEFT JOIN "Releases" r ON ra.release_id = r.id
                  LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
              WHERE r.id IS NOT NULL AND rt.type IS NOT NULL

              UNION

              SELECT DISTINCT a.id AS author_id, r.id AS release_id, rt.type AS release_type
              FROM "Authors" a
                  LEFT JOIN "Release_designers" rd ON a.id = rd.author_id
                  LEFT JOIN "Releases" r ON rd.release_id = r.id
                  LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
              WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
          ),

          release_ratings_aggregated AS (
              SELECT
                  ar.author_id,
                  ar.release_type,
                  rrt.type AS rating_type,
                  AVG(rr.total) AS avg_rating
              FROM author_releases ar
                  JOIN "Release_ratings" rr ON ar.release_id = rr.release_id
                  JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.total > 0
              GROUP BY ar.author_id, ar.release_type, rrt.type
          ),

          release_stats AS (
              SELECT
                  awt.author_id,
                  awt.release_type,
                  CEIL(MAX(CASE WHEN rra.rating_type = 'Оценка без рецензии' THEN rra.avg_rating END)) AS avg_no_text,
                  CEIL(MAX(CASE WHEN rra.rating_type = 'Оценка с рецензией' THEN rra.avg_rating END)) AS avg_with_text,
                  CEIL(MAX(CASE WHEN rra.rating_type = 'Оценка медиа' THEN rra.avg_rating END)) AS avg_media
              FROM authors_with_types awt
                  LEFT JOIN release_ratings_aggregated rra
                      ON rra.author_id = awt.author_id
                          AND rra.release_type = awt.release_type
              GROUP BY awt.author_id, awt.release_type
          ),

          -- > 20%
          bucket_totals AS (
              SELECT
                  nomination_type_id,
                  year,
                  month,
                  SUM(votes) AS total_votes
              FROM "Nomination_results"
              GROUP BY nomination_type_id, year, month
          ),

          candidates_with_share AS (
              SELECT
                  r.nomination_type_id,
                  r.year,
                  r.month,
                  r.entity_kind,
                  r.author_id,
                  r.release_id,
                  r.votes,
                  bt.total_votes,
                  CASE
                      WHEN bt.total_votes > 0 THEN (r.votes::numeric / bt.total_votes::numeric)
                      ELSE 0
                  END AS vote_share
              FROM "Nomination_results" r
                  JOIN bucket_totals bt
                      ON bt.nomination_type_id = r.nomination_type_id
                          AND bt.year = r.year
                          AND bt.month = r.month
          ),

          eligible_candidates AS (
              SELECT *
              FROM candidates_with_share
              WHERE vote_share > 0.2
          ),

          eligible_participants AS (
              SELECT
                  ec.nomination_type_id,
                  ec.year,
                  ec.month,
                  'author'::text AS entity_kind,
                  ec.author_id AS entity_id,
                  ec.author_id AS participant_author_id
              FROM eligible_candidates ec
              WHERE ec.entity_kind = 'author' AND ec.author_id IS NOT NULL

              UNION ALL

              -- release-кандидаты — участники релиза (artists)
              SELECT
                  ec.nomination_type_id,
                  ec.year,
                  ec.month,
                  'release'::text AS entity_kind,
                  ec.release_id AS entity_id,
                  ra.author_id AS participant_author_id
              FROM eligible_candidates ec
                  JOIN "Release_artists" ra ON ra.release_id = ec.release_id
              WHERE ec.entity_kind = 'release'

              UNION ALL

              -- release producers
              SELECT
                  ec.nomination_type_id,
                  ec.year,
                  ec.month,
                  'release'::text AS entity_kind,
                  ec.release_id AS entity_id,
                  rp.author_id AS participant_author_id
              FROM eligible_candidates ec
                  JOIN "Release_producers" rp ON rp.release_id = ec.release_id
              WHERE ec.entity_kind = 'release'

              UNION ALL

              -- release designers
              SELECT
                  ec.nomination_type_id,
                  ec.year,
                  ec.month,
                  'release'::text AS entity_kind,
                  ec.release_id AS entity_id,
                  rd.author_id AS participant_author_id
              FROM eligible_candidates ec
                  JOIN "Release_designers" rd ON rd.release_id = ec.release_id
              WHERE ec.entity_kind = 'release'
          ),

          eligible_distinct AS (
              SELECT
                  participant_author_id AS author_id,
                  nomination_type_id,
                  year,
                  month,
                  entity_kind,
                  entity_id
              FROM eligible_participants
              GROUP BY participant_author_id, nomination_type_id, year, month, entity_kind, entity_id
          ),

          nominations_count_by_author AS (
              SELECT author_id, COUNT(*)::int AS nominations_count
              FROM eligible_distinct
              GROUP BY author_id
          ),

          participations_by_type AS (
              SELECT
                  ed.author_id,
                  ed.nomination_type_id,
                  COUNT(*)::int AS cnt
              FROM eligible_distinct ed
              GROUP BY ed.author_id, ed.nomination_type_id
          ),

          nomination_participations_by_author AS (
              SELECT
                  p.author_id,
                  COALESCE(
                      jsonb_agg(
                              jsonb_build_object('name', nt.type, 'count', p.cnt)
                              ORDER BY nt.type
                      ),
                      '[]'::jsonb
                  ) AS nomination_participations
              FROM participations_by_type p
                  JOIN "Nomination_types" nt ON nt.id = p.nomination_type_id
              GROUP BY p.author_id
          ),

          wins_count_by_author AS (
              SELECT participant_author_id AS author_id, COUNT(*)::int AS wins_count
              FROM "Nomination_winner_participations"
              GROUP BY participant_author_id
          ),

          registered_authors_flag AS (
              SELECT
                  a.id,
                  EXISTS (
                      SELECT 1 FROM "Registered_authors" ra WHERE ra.author_id = a.id
                  ) AS is_registered
              FROM "Authors" a
          ),

          filtered_authors AS (
              SELECT a.id AS author_id
              FROM "Authors" a
                  JOIN params p ON TRUE
              WHERE
                  (p.id_ IS NULL OR p.id_ = '' OR a.id::text = p.id_)

                  AND (p.type_id_ IS NULL OR p.type_id_ = ''
                      OR EXISTS (
                          SELECT 1
                          FROM "Authors_on_types" aot
                          WHERE aot.author_id = a.id
                              AND aot.author_type_id::text = p.type_id_
                      )
                  )

                  AND (p.is_registered IS NULL OR p.is_registered = FALSE
                      OR EXISTS (
                          SELECT 1 FROM "Registered_authors" ra WHERE ra.author_id = a.id
                      )
                  )

                  AND (p.user_id IS NULL OR p.user_id = ''
                      OR EXISTS (
                          SELECT 1 FROM "Registered_authors" ra WHERE ra.author_id = a.id AND ra.user_id::text = p.user_id
                      )
                  )

                  AND (p.search IS NULL OR p.search = ''
                      OR a.name ILIKE '%' || p.search || '%'
                  )
          ),

          agg_stats AS (
              SELECT COUNT(*)::int AS total_count
              FROM filtered_authors
          ),

          page AS (
              SELECT
                  jsonb_build_object(
                          'id', a.id,
                          'name', a.name,
                          'avatar', a.avatar_img,
                          'cover', a.cover_img,
                          'isRegistered', COALESCE(raf.is_registered, false),
                          'userFavAuthor', COALESCE(ufa_arr.userFavAuthor, '[]'::jsonb),
                          'authorTypes', COALESCE(at_arr.authorTypes, '[]'::jsonb),
                          'releaseTypeRatings', COALESCE(rs_arr.releaseTypeRatings, '[]'::jsonb),
                          'nominations', jsonb_build_object(
                                  'totalCount', COALESCE(nc.nominations_count, 0),
                                  'winsCount', COALESCE(wc.wins_count, 0),
                                  'participations', COALESCE(npa.nomination_participations, '[]'::jsonb)
                                  )
                  ) AS item_json,
                  a.name AS sort_by_name,
                  COALESCE(nc.nominations_count, 0) AS sort_by_nominations,
                  a.id AS sort_id
              FROM filtered_authors fa
                  JOIN "Authors" a ON a.id = fa.author_id
                  LEFT JOIN registered_authors_flag raf ON raf.id = a.id

                  -- userFavAuthor
                  LEFT JOIN LATERAL (
                      SELECT
                          CASE
                              WHEN COUNT(ufa.user_id) = 0 THEN '[]'::jsonb
                              ELSE jsonb_agg(DISTINCT jsonb_build_object('userId', ufa.user_id, 'authorId', ufa.author_id))
                          END AS userFavAuthor
                      FROM "User_fav_authors" ufa
                      WHERE ufa.author_id = a.id
                  ) ufa_arr ON TRUE

                  -- authorTypes
                  LEFT JOIN LATERAL (
                      SELECT
                          CASE
                              WHEN COUNT(atl.id) = 0 THEN '[]'::jsonb
                              ELSE jsonb_agg(DISTINCT jsonb_build_object('id', atl.id, 'type', atl.type))
                          END AS authorTypes
                      FROM "Authors_on_types" aot2
                          JOIN "Author_types" atl ON atl.id = aot2.author_type_id
                      WHERE aot2.author_id = a.id
                  ) at_arr ON TRUE

                  -- releaseTypeRatings
                  LEFT JOIN LATERAL (
                      SELECT COALESCE(
                                  jsonb_agg(
                                          jsonb_build_object(
                                                  'type', rs.release_type,
                                                  'ratings', jsonb_build_object(
                                                      'withoutText', rs.avg_no_text,
                                                      'withText', rs.avg_with_text,
                                                      'media', rs.avg_media
                                                      )
                                          ) ORDER BY rs.release_type
                                  ),
                                  '[]'::jsonb
                      ) AS releaseTypeRatings
                      FROM release_stats rs
                      WHERE rs.author_id = a.id
                  ) rs_arr ON TRUE

                  LEFT JOIN nominations_count_by_author nc ON nc.author_id = a.id
                  LEFT JOIN wins_count_by_author wc ON wc.author_id = a.id
                  LEFT JOIN nomination_participations_by_author npa ON npa.author_id = a.id
          ),

          paged AS (
              SELECT *
              FROM page
              ORDER BY sort_by_name NULLS LAST, sort_id
              LIMIT (SELECT limit_ FROM params)
              OFFSET (SELECT offset_ FROM params)
          )

      SELECT
          jsonb_build_object(
                  'items', COALESCE((SELECT JSONB_AGG(p.item_json) FROM paged p), '[]'::jsonb),
                  'meta', jsonb_build_object('count', agg.total_count)
          ) AS result
      FROM agg_stats agg;
    `;

    const [result] = await this.prisma.$queryRaw<AuthorsRawQueryArrayDto>(sql);

    return result;
  }
}
