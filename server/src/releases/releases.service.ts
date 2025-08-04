import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, Release } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { FileService } from 'src/file/files.service';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import {
  AdminReleaseDto,
  AdminReleasesResponseDto,
} from './dto/admin-releases.response.dto';
import { CreateReleaseDto } from './dto/create-release.dto';
import {
  QueryReleaseDetailResponseDto,
  ReleaseDetailsResponseDto,
} from './dto/release-details.response.dto';
import {
  ReleaseResponseData,
  ReleaseResponseDto,
} from './dto/release.response.dto';
import { ReleasesQueryDto } from './dto/releases-query.dto';
import { TopRatingReleasesQuery } from './dto/top-rating-releases-query.dto';
import { TopRatingReleasesResponseDto } from './dto/top-rating-releases.response.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseTypesService: ReleaseTypesService,
    private readonly authorsService: AuthorsService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createReleaseDto: CreateReleaseDto,
    cover?: Express.Multer.File,
  ): Promise<AdminReleaseDto> {
    await this.releaseTypesService.findOne(createReleaseDto.releaseTypeId);

    const coverImg = cover
      ? await this.fileService.saveFile(cover, 'releases')
      : '';

    const allAuthorIds = [
      ...(createReleaseDto.releaseArtists ?? []),
      ...(createReleaseDto.releaseProducers ?? []),
      ...(createReleaseDto.releaseDesigners ?? []),
    ];

    const uniqueAuthorIds = [...new Set(allAuthorIds)];
    const isAuthorsExist =
      await this.authorsService.checkAuthorsExist(uniqueAuthorIds);

    if (!isAuthorsExist) {
      throw new BadRequestException(
        'Один или несколько указанных авторов не существуют',
      );
    }

    const artistConnections = createReleaseDto.releaseArtists?.map((id) => ({
      author: {
        connect: { id },
      },
    }));

    const producerConnections = createReleaseDto.releaseProducers?.map(
      (id) => ({
        author: {
          connect: { id },
        },
      }),
    );

    const designerConnections = createReleaseDto.releaseDesigners?.map(
      (id) => ({
        author: {
          connect: { id },
        },
      }),
    );

    const created = await this.prisma.release.create({
      data: {
        title: createReleaseDto.title,
        publishDate: createReleaseDto.publishDate,
        img: coverImg,
        releaseTypeId: createReleaseDto.releaseTypeId,
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

  async findAll(query: ReleasesQueryDto): Promise<AdminReleasesResponseDto> {
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

  async findOne(id: string): Promise<Release> {
    const existingRelease = await this.prisma.release.findUnique({
      where: { id },
    });

    if (!existingRelease) {
      throw new EntityNotFoundException('Релиз', 'id', `${id}`);
    }

    return existingRelease;
  }

  async update(
    id: string,
    updateReleaseDto: UpdateReleaseDto,
    cover?: Express.Multer.File,
  ): Promise<AdminReleaseDto> {
    if (
      (!updateReleaseDto || Object.keys(updateReleaseDto).length === 0) &&
      !cover
    ) {
      throw new NoDataProvidedException();
    }

    const release = await this.findOne(id);

    if (updateReleaseDto.releaseTypeId) {
      await this.releaseTypesService.findOne(updateReleaseDto.releaseTypeId);
    }

    const allAuthorIds = [
      ...(updateReleaseDto.releaseArtists ?? []),
      ...(updateReleaseDto.releaseProducers ?? []),
      ...(updateReleaseDto.releaseDesigners ?? []),
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
      if (cover && updateReleaseDto.clearCover !== true) {
        newImg = await this.fileService.saveFile(cover, 'releases');
      }

      const updatedRelease = await this.prisma.$transaction(async (prisma) => {
        const data: Prisma.ReleaseUpdateInput = {
          ...(updateReleaseDto.title && { title: updateReleaseDto.title }),
          ...(updateReleaseDto.publishDate && {
            publishDate: updateReleaseDto.publishDate,
          }),
          img: updateReleaseDto.clearCover ? '' : newImg,
          ...(updateReleaseDto.releaseTypeId && {
            ReleaseType: { connect: { id: updateReleaseDto.releaseTypeId } },
          }),
        };

        if (updateReleaseDto.releaseArtists !== undefined) {
          await prisma.releaseArtist.deleteMany({
            where: { releaseId: id },
          });

          data.releaseArtist = {
            create: updateReleaseDto.releaseArtists.map((authorId) => ({
              author: { connect: { id: authorId } },
            })),
          };
        }

        if (updateReleaseDto.releaseProducers !== undefined) {
          await prisma.releaseProducer.deleteMany({
            where: { releaseId: id },
          });

          data.releaseProducer = {
            create: updateReleaseDto.releaseProducers.map((authorId) => ({
              author: { connect: { id: authorId } },
            })),
          };
        }

        if (updateReleaseDto.releaseDesigners !== undefined) {
          await prisma.releaseDesigner.deleteMany({
            where: { releaseId: id },
          });

          data.releaseDesigner = {
            create: updateReleaseDto.releaseDesigners.map((authorId) => ({
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

      if ((cover || updateReleaseDto.clearCover) && release.img !== '') {
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
      SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
      FROM best_releases_last_24h LIMIT 15;
    `;
  }

  async findReleaseDetails(
    releaseId: string,
  ): Promise<ReleaseDetailsResponseDto> {
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
    findAll: boolean,
  ): Promise<ReleaseResponseData[]> {
    const rawQuery = `
          WITH release_data as (
            SELECT
                r.id,
                r.title,
                r.img,
                r.publish_date,
                rt.type AS release_type,
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS text_count,
                (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS no_text_count,
                json_agg(DISTINCT jsonb_build_object('id', a.id,'name', a.name)) as author,
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
                json_agg(DISTINCT jsonb_build_object(
                        'total', rr.total,
                        'type', rrt.type
                )) as ratings,
                (SELECT rr.total FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'super_user') AS super_user_rating,
                (SELECT rr.total FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'with_text') AS text_rating,
                (SELECT rr.total FROM "Release_ratings" rr
                                          JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
                WHERE rr.release_id = r.id AND rrt.type = 'no_text') AS no_text_rating

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
        SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
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
    query: TopRatingReleasesQuery,
  ): Promise<TopRatingReleasesResponseDto> {
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
              rt.type AS release_type,
              (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS text_count,
              (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS no_text_count,
              CASE
                  WHEN count(a.id) = 0 THEN '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name))
              END as author,
              CASE
                  WHEN count(rr.total) = 0 THEN '[]'::json
                  ELSE json_agg(DISTINCT jsonb_build_object(
                          'total', rr.total,
                          'type', rrt.type
              ))
              END as ratings,
              (SELECT rr.total FROM "Release_ratings" rr
                                        JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'super_user') AS super_user_rating,
              (SELECT rr.total FROM "Release_ratings" rr
                                        JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'with_text') AS text_rating,
              (SELECT rr.total FROM "Release_ratings" rr
                                        JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
              WHERE rr.release_id = r.id AND rrt.type = 'no_text') AS no_text_rating

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
      SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
      FROM release_data rd
      WHERE (${year} IS NULL OR EXTRACT(YEAR FROM rd.publish_date) = ${year})
        AND (${month} IS NULL OR EXTRACT(MONTH FROM rd.publish_date) = ${month})
      ORDER BY no_text_rating + text_rating + super_user_rating desc, id ASC
    `;
    const releases =
      await this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);

    return { minYear, maxYear, releases };
  }

  async findReleases(query: ReleasesQueryDto): Promise<ReleaseResponseDto> {
    const type = query.typeId ? `'${query.typeId}'` : null;

    const fieldMap: Record<string, string> = {
      noTextCount: 'no_text_count',
      textCount: 'text_count',
      published: 'rd.publish_date',
      superUserRating: 'super_user_rating',
      noTextRating: 'no_text_rating',
      withTextRating: 'text_rating',
    };

    const field = query.field ? fieldMap[query.field] : fieldMap['published'];
    const order = query.order ? query.order : 'desc';
    // const limit = query.limit ? query.limit : 20;
    // const offset = query.offset ? query.offset : 0;
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
          r.publish_date,
          rt.type AS release_type,
          (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS text_count,
          (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS no_text_count,
          CASE
              WHEN count(a.id) = 0 THEN '[]'::json
              ELSE json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name))
          END as author,
          CASE
              WHEN count(rr.total) = 0 THEN '[]'::json
              ELSE json_agg(DISTINCT jsonb_build_object(
                      'total', rr.total,
                      'type', rrt.type
          ))
           END as ratings,
          (SELECT rr.total FROM "Release_ratings" rr
              JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
          WHERE rr.release_id = r.id AND rrt.type = 'super_user') AS super_user_rating,

          (SELECT rr.total FROM "Release_ratings" rr
              JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
          WHERE rr.release_id = r.id AND rrt.type = 'with_text') AS text_rating,

          (SELECT rr.total FROM "Release_ratings" rr
              JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
          WHERE rr.release_id = r.id AND rrt.type = 'no_text') AS no_text_rating

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
      SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
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
