import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Author, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesService } from 'src/author-types/author-types.service';
import { FileService } from 'src/file/files.service';
import { DuplicateFieldException } from 'src/shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { CreateAuthorRequestDto } from './dto/request/create-author.request.dto';
import { FindAuthorsQuery } from './dto/request/query/find-authors.query.dto';
import { UpdateAuthorRequestDto } from './dto/request/update-author.request.dto';
import {
  AdminAuthorDto,
  AdminFindAuthorsResponseDto,
} from './dto/response/admin-find-authors.response.dto';
import { AuthorDetailsResponseDto } from './dto/response/author-details.response.dto';
import { FindAuthorsResponseDto } from './dto/response/find-authors.response.dto';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorTypesService: AuthorTypesService,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateAuthorRequestDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Author> {
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

      return plainToInstance(AdminAuthorDto, created);
    } catch {
      if (avatarImg !== '')
        await this.fileService.deleteFile(`authors/avatars/${avatarImg}`);

      if (coverImg !== '')
        await this.fileService.deleteFile(`authors/covers/${coverImg}`);
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: FindAuthorsQuery): Promise<AdminFindAuthorsResponseDto> {
    const { limit, offset, query: name, typeId } = query;

    if (typeId) {
      await this.authorTypesService.findOne(typeId);
    }

    const where: Prisma.AuthorWhereInput = {
      AND: [
        {
          types: typeId
            ? {
                some: {
                  authorTypeId: typeId,
                },
              }
            : undefined,
        },
        {
          name: {
            contains: name ?? '',
            mode: 'insensitive',
          },
        },
      ],
    };

    const [count, authors] = await Promise.all([
      this.prisma.author.count({ where }),
      this.prisma.author.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          types: {
            include: {
              authorType: true,
            },
          },
        },
      }),
    ]);

    return plainToInstance(AdminFindAuthorsResponseDto, { count, authors });
  }

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

  async findOne(id: string): Promise<Author> {
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      throw new EntityNotFoundException('Автор', 'id', `${id}`);
    }

    return existingAuthor;
  }

  async update(
    id: string,
    dto: UpdateAuthorRequestDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Author> {
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

      return plainToInstance(AdminAuthorDto, updated);
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

  async remove(id: string): Promise<Author> {
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

    return author;
  }

  async findById(id: string): Promise<AuthorDetailsResponseDto> {
    await this.findOne(id);

    const rawQuery = this.getBaseQuery(`
      WHERE 
        (a.id = '${id}')
      `);

    const [author] =
      await this.prisma.$queryRawUnsafe<AuthorDetailsResponseDto[]>(rawQuery);
    return author;
  }

  async findAuthors(query: FindAuthorsQuery): Promise<FindAuthorsResponseDto> {
    const typeId = query.typeId ? `'${query.typeId}'` : null;
    const name = query.query ?? null;
    const { limit, offset = 0, onlyRegistered = false, userId } = query;

    if (query.typeId) {
      await this.authorTypesService.findOne(query.typeId);
    }

    const count = await this.prisma.author.count({
      where: {
        AND: [
          {
            types: query.typeId
              ? {
                  some: {
                    authorTypeId: query.typeId,
                  },
                }
              : undefined,
          },
          {
            name: {
              contains: name ?? '',
              mode: 'insensitive',
            },
          },
          onlyRegistered
            ? {
                registeredAuthor: {
                  some: { userId },
                },
              }
            : {},
        ],
      },
    });

    const rawQuery = this.getBaseQuery(
      `WHERE (${typeId} IS NULL OR at.id = ${typeId}) AND
        (${name ? `'${name}'` : name}::text IS NULL OR a.name ILIKE '%' || ${name ? `'${name}'` : name} || '%') AND
        (${onlyRegistered ? 'raf.is_registered = true' : 'true'})`,
      `ORDER BY
          a.id
        ${limit !== undefined ? `LIMIT ${limit}` : ''} OFFSET ${offset};`,
      userId,
    );

    const authors =
      await this.prisma.$queryRawUnsafe<AuthorDetailsResponseDto[]>(rawQuery);

    return { count, authors };
  }

  private async findByName(name: string): Promise<Author | null> {
    return this.prisma.author.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  private getBaseQuery(where?: string, order?: string, userId?: string) {
    return `
        WITH
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
        /* ---- Номинации: >20% голосов ---- */
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
              CASE WHEN bt.total_votes > 0
                  THEN (r.votes::numeric / bt.total_votes::numeric)
                  ELSE 0 END AS vote_share
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
            -- author-кандидаты — сам автор
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
            -- release-кандидаты — участники релиза
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
            -- дедуп по бакету и сущности для автора
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
        -- группировка участий по типу номинации для JSON-деталей
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
            -- победы: 1 строка на победу x автор в view, уже без дублей по ролям
            SELECT participant_author_id AS author_id, COUNT(*)::int AS wins_count
            FROM "Nomination_winner_participations"
            GROUP BY participant_author_id
        ),
        registered_authors_flag AS (
            SELECT
                a.id,
                EXISTS(
                  SELECT 1 FROM "Registered_authors" ra
                  WHERE ra.author_id = a.id
                  ${userId ? `AND ra.user_id = '${userId}'` : ''}
                ) AS is_registered
            FROM "Authors" a
        )
        SELECT
            a.id,
            a.avatar_img AS img,
            a.cover_img AS cover,
            a.name,

            COUNT(DISTINCT ufa.user_id)::int AS "favCount",
            CASE
                WHEN COUNT(ufa.user_id) = 0 THEN '[]'::json
                ELSE json_agg(DISTINCT jsonb_build_object(
                        'userId', ufa.user_id,
                        'authorId', ufa.author_id
                ))
            END AS "userFavAuthor",

            CASE
                WHEN COUNT(at.id) = 0 THEN '[]'::json
                ELSE json_agg(DISTINCT jsonb_build_object(
                        'id', at.id,
                        'type', at.type
                ))
            END AS "authorTypes",

            jsonb_agg(
              jsonb_build_object(
                'type', rs.release_type,
                'ratings', jsonb_build_object(
                  'withoutText', rs.avg_no_text,
                  'withText',    rs.avg_with_text,
                  'media',       rs.avg_media
                )
              )
            ) FILTER (WHERE rs.release_type IS NOT NULL) AS "releaseTypeRatings",

            COALESCE(raf.is_registered, false) AS "isRegistered",

            COALESCE(nc.nominations_count, 0) AS "nominationsCount",
            COALESCE(wc.wins_count, 0)        AS "winsCount",
            COALESCE(npa.nomination_participations, '[]'::jsonb) AS "nominationParticipations"

        FROM "Authors" a
        LEFT JOIN "Authors_on_types" aot ON a.id = aot.author_id
        LEFT JOIN "Author_types" at ON aot.author_type_id = at.id
        LEFT JOIN release_stats rs ON a.id = rs.author_id
        LEFT JOIN "User_fav_authors" ufa ON a.id = ufa.author_id
        LEFT JOIN registered_authors_flag raf ON a.id = raf.id
        LEFT JOIN nominations_count_by_author nc ON nc.author_id = a.id
        LEFT JOIN wins_count_by_author wc ON wc.author_id = a.id
        LEFT JOIN nomination_participations_by_author npa ON npa.author_id = a.id

        ${where ?? ''}

        GROUP BY
            a.id,
            a.name,
            a.avatar_img,
            raf.is_registered,
            nc.nominations_count,
            wc.wins_count,
            npa.nomination_participations

        ${order ?? ''}
    `;
  }
}
