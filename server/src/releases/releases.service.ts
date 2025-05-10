import { Injectable } from '@nestjs/common';
import { Release } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import {
  QueryReleaseDetailResponseDto,
  ReleaseDetailResponseDto,
} from './dto/release-detail.response.dto';
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
  ) {}

  async create(createReleaseDto: CreateReleaseDto): Promise<Release> {
    await this.releaseTypesService.findOne(createReleaseDto.releaseTypeId);
    return this.prisma.release.create({
      data: createReleaseDto,
    });
  }

  async findAll(): Promise<Release[]> {
    return this.prisma.release.findMany();
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
  ): Promise<Release> {
    if (!updateReleaseDto || Object.keys(updateReleaseDto).length === 0) {
      throw new NoDataProvidedException();
    }

    if (updateReleaseDto.releaseTypeId) {
      await this.releaseTypesService.findOne(updateReleaseDto.releaseTypeId);
    }

    return this.prisma.release.update({
      where: { id },
      data: updateReleaseDto,
    });
  }

  async remove(id: string): Promise<Release> {
    await this.findOne(id);
    return this.prisma.release.delete({
      where: { id },
    });
  }

  async findMostCommentedReleasesLastDay(): Promise<ReleaseResponseData[]> {
    return this.prisma.$queryRaw<ReleaseResponseData[]>`
      SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
      FROM best_releases_last_24h LIMIT 15;
    `;
  }

  async findReleaseDetails(
    releaseId: string,
  ): Promise<ReleaseDetailResponseDto> {
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
            FROM jsonb_array_elements(rd.author::jsonb) AS a
            WHERE (a->>'id')::text = '${authorId}'
        )
        ORDER BY ${findAll ? 'rd.publish_date' : 'no_text_rating + text_rating + super_user_rating'} desc
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
              json_agg(DISTINCT jsonb_build_object('id', a.id,'name', a.name)) as author,
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
      WHERE (${year} IS NULL OR EXTRACT(YEAR FROM rd.publish_date) = ${year})
        AND (${month} IS NULL OR EXTRACT(MONTH FROM rd.publish_date) = ${month})
      ORDER BY no_text_rating + text_rating + super_user_rating desc
    `;
    const releases =
      await this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);

    return { minYear, maxYear, releases };
  }

  async findReleases(query: ReleasesQueryDto): Promise<ReleaseResponseDto> {
    const type = query.type ? `'${query.type}'` : null;

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
    const limit = query.limit ? query.limit : 20;
    const offset = query.offset ? query.offset : 0;
    const title = query.query ?? null;

    const count = await this.prisma.release.count({
      where: {
        AND: [
          { releaseTypeId: query.type ?? undefined },
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
          json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name)) as author,
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
              LEFT JOIN "Reviews" rev on rev.release_id = r.id
              LEFT JOIN "Release_ratings" rr on rr.release_id = r.id
              LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
          WHERE (${type} IS NULL OR r.release_type_id = ${type}) AND
          (${title ? `'${title}'` : title}::text IS NULL OR r.title ILIKE '%' || ${title ? `'${title}'` : title} || '%')
          GROUP BY r.id, rt.type, r.publish_date
      )
      SELECT id, title, img, release_type, text_count, no_text_count, author, ratings
      FROM release_data rd
      ORDER BY ${field} ${order}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const releases =
      await this.prisma.$queryRawUnsafe<ReleaseResponseData[]>(rawQuery);

    return { count, releases };
  }
}
