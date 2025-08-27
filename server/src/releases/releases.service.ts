import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, Release } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { FileService } from 'src/file/files.service';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { CreateReleaseRequestDto } from './dto/request/create-release.response.dto';
import { FindReleasesByAuthorIdQuery } from './dto/request/query/find-releases-by-author-id.query.dto';
import { FindReleasesQuery } from './dto/request/query/find-releases.query.dto';
import { FindTopRatingReleasesQuery } from './dto/request/query/find-top-rating-releases.query.dto';
import { UpdateReleaseRequestDto } from './dto/request/update-release.request.dto';
import {
  AdminReleaseDto,
  FindAdminReleasesResponseDto,
} from './dto/response/find-admin-releases.response.dto';
import {
  FindReleaseDetailsResponseDto,
  QueryReleaseDetailResponseDto,
} from './dto/response/find-release-details.response.dto';
import {
  FindReleasesResponseDto,
  ReleaseResponseData,
} from './dto/response/find-releases.response.dto';
import { FindTopRatingReleasesResponseDto } from './dto/response/find-top-rating-releases.response.dto';
import { ReleaseSortFieldsEnum } from './types/release-sort-fields.enum';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseTypesService: ReleaseTypesService,
    private readonly authorsService: AuthorsService,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateReleaseRequestDto,
    cover?: Express.Multer.File,
  ): Promise<AdminReleaseDto> {
    await this.releaseTypesService.findOne(dto.releaseTypeId);

    const coverImg = cover
      ? await this.fileService.saveFile(cover, 'releases')
      : '';

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

    return this.getAdminRelease(created.id);
  }

  async findAll(
    query: FindReleasesQuery,
  ): Promise<FindAdminReleasesResponseDto> {
    const { limit, offset, typeId, query: searchQuery, order } = query;

    if (typeId) {
      await this.releaseTypesService.findOne(typeId);
    }

    const andConditions: Prisma.ReleaseWhereInput[] = [];

    if (typeId) {
      andConditions.push({ releaseTypeId: typeId });
    }

    if (searchQuery) {
      const orConditions: Prisma.ReleaseWhereInput[] = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        {
          releaseArtist: {
            some: {
              author: { name: { contains: searchQuery, mode: 'insensitive' } },
            },
          },
        },
        {
          releaseProducer: {
            some: {
              author: { name: { contains: searchQuery, mode: 'insensitive' } },
            },
          },
        },
        {
          releaseDesigner: {
            some: {
              author: { name: { contains: searchQuery, mode: 'insensitive' } },
            },
          },
        },
      ];
      andConditions.push({ OR: orConditions });
    }

    const where: Prisma.ReleaseWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [count, releases] = await Promise.all([
      this.prisma.release.count({ where }),
      this.prisma.release.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ publishDate: order ?? 'desc' }, { id: 'desc' }],
        include: {
          releaseType: true,
          releaseArtist: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          releaseProducer: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          releaseDesigner: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      count,
      releases: plainToInstance(AdminReleaseDto, releases, {
        excludeExtraneousValues: true,
      }),
    };
  }

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

  async update(
    id: string,
    dto: UpdateReleaseRequestDto,
    cover?: Express.Multer.File,
  ): Promise<AdminReleaseDto> {
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

      return this.getAdminRelease(updatedRelease.id);
    } catch {
      if (newImg) {
        await this.fileService.deleteFile('releases/' + newImg);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<Release> {
    await this.findOne(id);

    const release = await this.prisma.release.delete({
      where: { id },
    });

    if (release.img !== '') {
      await this.fileService.deleteFile('releases/' + release.img);
    }

    return release;
  }

  async findMostCommentedReleasesLastDay(): Promise<ReleaseResponseData[]> {
    return this.prisma.$queryRaw<ReleaseResponseData[]>`
      SELECT 
        id, 
        title, 
        img, 
        "releaseType", 
        "textCount", 
        "withoutTextCount", 
        authors, 
        ratings,
        "hasAuthorComments",
        "hasAuthorLikes"
      FROM most_reviewed_releases_last_24h 
      LIMIT 15;
    `;
  }

  async findReleaseDetails(
    releaseId: string,
  ): Promise<FindReleaseDetailsResponseDto> {
    const rawQuery = `
        SELECT * FROM release_summary WHERE id = '${releaseId}'`;

    const release =
      await this.prisma.$queryRawUnsafe<QueryReleaseDetailResponseDto>(
        rawQuery,
      );

    return release[0];
  }

  async findAuthorReleases(
    authorId: string,
    query: FindReleasesByAuthorIdQuery,
  ): Promise<ReleaseResponseData[]> {
    const { findAll } = query;
    const rawQuery = `
          WITH release_data as (
            SELECT
                r.id,
                r.title,
                r.img,
                r.publish_date,
                rt.type AS "releaseType",
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS "textCount",
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS "withoutTextCount",
                CASE 
                  WHEN count(a.id) = 0 THEN '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object(
                            'id', a.id,
                            'name', a.name
                  )) 
                END as author,
                (
                  SELECT
                      json_agg(DISTINCT jsonb_build_object('id', asub.id,'name', asub.name))
                  FROM "Releases" rsub
                  LEFT JOIN "Release_artists" rasub on r.id = rasub.release_id
                  LEFT JOIN "Release_producers" rpsub on r.id = rpsub.release_id
                  LEFT JOIN "Release_designers" rdsub on r.id = rdsub.release_id
                  LEFT JOIN "Authors" asub on
                      rasub.author_id = asub.id
                          OR rpsub.author_id = asub.id
                          OR rdsub.author_id = asub.id
                ) as authors,
                CASE 
                  WHEN count(rr.total) = 0 then '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object(
                        'total', rr.total,
                        'type', rrt.type
                ))
                END as ratings,
                (SELECT rr.total FROM "Release_ratings" rr
                   JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'Оценка медиа') AS super_user_rating,
                (SELECT rr.total FROM "Release_ratings" rr
                    JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'Оценка с рецензией') AS text_rating,
                (SELECT rr.total FROM "Release_ratings" rr
                    JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'Оценка без рецензии') AS no_text_rating,

                EXISTS (
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
                    )
                ) AS "hasAuthorComments",

                (
                  EXISTS (
                      SELECT 1
                      FROM "User_fav_reviews" ufr
                              JOIN "Reviews" r2 ON r2.id = ufr.review_id
                              JOIN "Registered_authors" ra2 ON ra2.user_id = ufr.user_id
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
                OR
                  EXISTS (
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
              ) AS "hasAuthorLikes"

            FROM "Releases" r
                    LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
                    LEFT JOIN "Release_artists" ra on r.id = ra.release_id
                    LEFT JOIN "Authors" a on ra.author_id = a.id
                    LEFT JOIN "Release_producers" rp on r.id = rp.release_id
                    LEFT JOIN "Release_designers" rd on r.id = rd.author_id
                    LEFT JOIN "Reviews" rev on rev.release_id = r.id
                    LEFT JOIN "Release_ratings" rr on rr.release_id = r.id
                    LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
            GROUP BY r.id, rt.type, r.publish_date
        )
        SELECT id, title, img, "releaseType", "textCount", "withoutTextCount", author as authors, ratings, "hasAuthorComments", "hasAuthorLikes"
        FROM release_data rd
        WHERE EXISTS (
            SELECT 1
            FROM jsonb_array_elements(rd.authors::jsonb) AS a
            WHERE (a->>'id')::text = '${authorId}'
        )
        ORDER BY ${findAll ? 'rd.publish_date' : 'no_text_rating + text_rating + super_user_rating'} desc, id ASC
        ${findAll ? '' : 'LIMIT 15 OFFSET 0'}
    `;
    return this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);
  }

  async findTopRatingReleases(
    query: FindTopRatingReleasesQuery,
  ): Promise<FindTopRatingReleasesResponseDto> {
    let month: number | null = null;
    let year: number | null = null;
    if (query.year && query.month) {
      month = query.month;
      year = query.year;
    }
    const years = await this.prisma.$queryRawUnsafe<
      {
        min_year: number;
        max_year: number;
      }[]
    >(`
      SELECT 
        EXTRACT(YEAR FROM MIN(publish_date)) as min_year,
        EXTRACT(YEAR FROM MAX(publish_date)) as max_year
      FROM "Releases"
    `);

    const minYear = years[0]?.min_year ?? new Date().getFullYear();
    const maxYear = years[0]?.max_year || new Date().getFullYear();

    const rawQuery = `
      WITH release_data as (
          SELECT
              r.id,
              r.title,
              r.img,
              r.publish_date,
              rt.type AS "releaseType",
              (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS "textCount",
              (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS "withoutTextCount",
              CASE
                  WHEN count(a.id) = 0 THEN '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object(
                          'id', a.id,
                          'name', a.name
                  ))
              END as authors,
              CASE
                  WHEN count(rr.total) = 0 THEN '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object(
                          'total', rr.total,
                          'type', rrt.type
                  ))
              END as ratings,
              (SELECT rr.total FROM "Release_ratings" rr
                  JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'Оценка медиа') AS super_user_rating,
              (SELECT rr.total FROM "Release_ratings" rr
                  JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'Оценка с рецензией') AS text_rating,
              (SELECT rr.total FROM "Release_ratings" rr
                  JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'Оценка без рецензии') AS no_text_rating,

              EXISTS (
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
                  )
              ) AS "hasAuthorComments",

              (
                EXISTS (
                    SELECT 1
                    FROM "User_fav_reviews" ufr
                            JOIN "Reviews" r2 ON r2.id = ufr.review_id
                            JOIN "Registered_authors" ra2 ON ra2.user_id = ufr.user_id
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
                OR
                EXISTS (
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
                ) AS "hasAuthorLikes"

          FROM "Releases" r
                  LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
                  LEFT JOIN "Release_artists" ra on r.id = ra.release_id
                  LEFT JOIN "Authors" a on ra.author_id = a.id
                  LEFT JOIN "Release_producers" rp on r.id = rp.release_id
                  LEFT JOIN "Release_designers" rd on r.id = rd.author_id
                  LEFT JOIN "Reviews" rev on rev.release_id = r.id
                  LEFT JOIN "Release_ratings" rr on rr.release_id = r.id
                  LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
          GROUP BY r.id, rt.type, r.publish_date
      )
      SELECT id, title, img, "releaseType", "textCount", "withoutTextCount", authors, ratings, "hasAuthorComments", "hasAuthorLikes"
      FROM release_data rd
      WHERE (${year} IS NULL OR EXTRACT(YEAR FROM rd.publish_date) = ${year})
        AND (${month} IS NULL OR EXTRACT(MONTH FROM rd.publish_date) = ${month})
      ORDER BY no_text_rating + text_rating + super_user_rating desc, id ASC
    `;
    const releases =
      await this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);

    return { minYear, maxYear, releases };
  }

  async findReleases(
    query: FindReleasesQuery,
  ): Promise<FindReleasesResponseDto> {
    const type = query.typeId ? `'${query.typeId}'` : null;

    const fieldMap: Record<string, string> = {
      [ReleaseSortFieldsEnum.WITHOUT_TEXT_COUNT]: '"withoutTextCount"',
      [ReleaseSortFieldsEnum.TEXT_COUNT]: '"textCount"',
      [ReleaseSortFieldsEnum.PUBLISHED]: 'rd."publishDate"',
      [ReleaseSortFieldsEnum.MEDIA_RATING]: '"mediaRating"',
      [ReleaseSortFieldsEnum.WITHOUT_TEXT_RATING]: '"withoutTextRating"',
      [ReleaseSortFieldsEnum.WITH_TEXT_RATING]: '"textRating"',
    };

    const field = query.field
      ? fieldMap[query.field]
      : fieldMap[ReleaseSortFieldsEnum.PUBLISHED];
    const order = query.order ? query.order : 'desc';
    const title = query.query ?? null;
    const { limit, offset } = query;

    const count = await this.prisma.release.count({
      where: {
        AND: [
          { releaseTypeId: query.typeId ?? undefined },
          {
            title: {
              contains: title ?? '',
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const rawQuery = `
      WITH release_data as (
          SELECT r.id,
                r.title,
                r.img,
                r.publish_date as "publishDate",
                rt.type AS "releaseType",
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS "textCount",
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS "withoutTextCount",
                CASE
                    WHEN count(a.id) = 0 THEN '[]'::json
                    ELSE json_agg(DISTINCT jsonb_build_object(
                            'id', a.id, 
                            'name', a.name
                    ))
                END as authors,
                CASE
                    WHEN count(rr.total) = 0 THEN '[]'::json
                    ELSE json_agg(DISTINCT jsonb_build_object(
                            'total', rr.total,
                            'type', rrt.type
                    ))
                END as ratings,
                (SELECT rr.total FROM "Release_ratings" rr
                    JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                  WHERE rr.release_id = r.id AND rrt.type = 'Оценка медиа') AS "mediaRating",

                (SELECT rr.total FROM "Release_ratings" rr
                    JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                  WHERE rr.release_id = r.id AND rrt.type = 'Оценка с рецензией') AS "textRating",

                (SELECT rr.total FROM "Release_ratings" rr
                    JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                  WHERE rr.release_id = r.id AND rrt.type = 'Оценка без рецензии') AS "withoutTextRating",

                EXISTS (
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
                    )
                ) AS "hasAuthorComments",
                         
                (
                  EXISTS (
                    SELECT 1
                    FROM "User_fav_reviews" ufr
                         JOIN "Reviews" r2 ON r2.id = ufr.review_id
                         JOIN "Registered_authors" ra2 ON ra2.user_id = ufr.user_id
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
                          FROM "Release_designers" 
                          rd WHERE rd.release_id = r.id
                ))
              OR
                  EXISTS (
                    SELECT 1
                      FROM "User_fav_media" ufm
                         JOIN "Release_media" rm ON rm.id = ufm.media_id
                         JOIN "Registered_authors" ra3 ON ra3.user_id = ufm.user_id
                    WHERE rm.release_id = r.id
                        AND ra3.author_id IN (
                            SELECT rp.author_id FROM 
                            "Release_producers" rp 
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
            )) AS "hasAuthorLikes"

          FROM "Releases" r
                  LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
                  LEFT JOIN "Release_artists" ra on r.id = ra.release_id
                  LEFT JOIN "Authors" a on ra.author_id = a.id
                  LEFT JOIN "Reviews" rev on rev.release_id = r.id
                  LEFT JOIN "Release_ratings" rr on rr.release_id = r.id
                  LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
          WHERE (${type} IS NULL OR r.release_type_id = ${type}) AND
              (${title ? `'${title}'` : title}::text IS NULL OR r.title ILIKE '%' || ${title ? `'${title}'` : title} || '%')
          GROUP BY r.id, rt.type, r.publish_date
      )
      SELECT id, title, img, "releaseType", "textCount", "withoutTextCount", authors, ratings,  "hasAuthorLikes", "hasAuthorComments"
      FROM release_data rd
      ORDER BY ${field} ${order}, id ASC
      ${limit !== undefined ? `LIMIT ${limit}` : ''} ${offset !== undefined ? `OFFSET ${offset}` : ''}
    `;

    const releases =
      await this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);

    return { count, releases };
  }

  private async getAdminRelease(id: string): Promise<AdminReleaseDto> {
    const release = await this.prisma.release.findUnique({
      where: { id },
      include: {
        releaseType: true,
        releaseArtist: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        releaseProducer: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        releaseDesigner: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!release) {
      throw new EntityNotFoundException('Релиз', 'id', `${id}`);
    }

    return plainToInstance(AdminReleaseDto, release, {
      excludeExtraneousValues: true,
    });
  }
}
