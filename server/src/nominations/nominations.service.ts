import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import { FindNominationCandidatesResponseDto } from './dto/response/find-nomination-candidates.response.dto';
import {
  FindNominationWinnersResponseDto,
  NominationMonthWinnerItemDto,
} from './dto/response/find-nomination-winners.response.dto';
import { FindNominationWinnersByAuthorIdResponseDto } from './dto/response/find-nominations-winners-by-author-id.response.dto';

@Injectable()
export class NominationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findNominationWinners(
    query: FindNominationWinnersQueryDto,
  ): Promise<FindNominationWinnersResponseDto> {
    const { year, month } = query;
    const dataQuery = `
			SELECT * FROM "Nomination_winners_monthly_json"
			WHERE 1=1 ${year !== undefined ? ` AND year=${year}` : ''} ${month !== undefined ? `AND month=${month}` : ''}
			ORDER BY month desc
		`;

    const yearRangeQuery = `
      SELECT 
        MIN(year) as "minYear", 
        MAX(year) as "maxYear"
      FROM "Nomination_winners_monthly_json"
    `;

    const [data, [yearRange]] = await Promise.all([
      this.prisma.$queryRawUnsafe<NominationMonthWinnerItemDto[]>(dataQuery),
      this.prisma.$queryRawUnsafe<{ minYear: number; maxYear: number }[]>(
        yearRangeQuery,
      ),
    ]);

    return { ...yearRange, items: data };
  }

  async findNominationWinnersByAuthorId(
    authorId: string,
  ): Promise<FindNominationWinnersByAuthorIdResponseDto> {
    const rawQuery = `
      SELECT *
      FROM "Nomination_winner_participations_enriched_json"
      WHERE "authorId" = '${authorId}'
    `;

    const data =
      await this.prisma.$queryRawUnsafe<
        FindNominationWinnersByAuthorIdResponseDto[]
      >(rawQuery);

    if (data.length === 0) {
      return {
        authorId,
        nominations: [],
      };
    }

    return data[0];
  }

  async findCandidates(): Promise<FindNominationCandidatesResponseDto> {
    const rawQuery = `
      WITH period AS (
        SELECT
          (date_trunc('month', now()) - interval '1 month')::date AS start_date,
          (date_trunc('month', now())::date - 1)                 AS end_date,
          EXTRACT(YEAR  FROM (date_trunc('month', now()) - interval '1 month'))::int  AS year,
          EXTRACT(MONTH FROM (date_trunc('month', now()) - interval '1 month'))::int  AS month
      )
      SELECT
        p.year,
        p.month,
        p.start_date AS "startDate",
        p.end_date   AS "endDate",

        COALESCE((
          SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', x.id,
                    'title', x.title,
                    'img', x.img,
                    'entityKind', 'release',
                    'authors', COALESCE((
                      SELECT jsonb_agg(name ORDER BY name)
                      FROM (
                        SELECT DISTINCT a.name AS name
                        FROM "Release_artists" ra
                        JOIN "Authors" a ON a.id = ra.author_id
                        WHERE ra.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_producers" rp
                        JOIN "Authors" a ON a.id = rp.author_id
                        WHERE rp.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_designers" rd
                        JOIN "Authors" a ON a.id = rd.author_id
                        WHERE rd.release_id = x.id
                      ) names
                    ), '[]'::jsonb)
                  )
                  ORDER BY x.title
                )
          FROM (
            SELECT DISTINCT r.id, r.title, r.img
            FROM "Releases" r
            JOIN "Release_types" rt ON rt.id = r.release_type_id
            WHERE r.publish_date::date BETWEEN p.start_date AND p.end_date
              AND rt.type = 'Альбом'
          ) x
        ), '[]'::jsonb) AS "albumCandidates",

        COALESCE((
          SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', x.id,
                    'title', x.title,
                    'img', x.img,
                    'entityKind', 'release',
                    'authors', COALESCE((
                      SELECT jsonb_agg(name ORDER BY name)
                      FROM (
                        SELECT DISTINCT a.name AS name
                        FROM "Release_artists" ra
                        JOIN "Authors" a ON a.id = ra.author_id
                        WHERE ra.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_producers" rp
                        JOIN "Authors" a ON a.id = rp.author_id
                        WHERE rp.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_designers" rd
                        JOIN "Authors" a ON a.id = rd.author_id
                        WHERE rd.release_id = x.id
                      ) names
                    ), '[]'::jsonb)
                  )
                  ORDER BY x.title
                )
          FROM (
            SELECT DISTINCT r.id, r.title, r.img
            FROM "Releases" r
            JOIN "Release_types" rt ON rt.id = r.release_type_id
            WHERE r.publish_date::date BETWEEN p.start_date AND p.end_date
              AND rt.type = 'Трек'
          ) x
        ), '[]'::jsonb) AS "singleCandidates",

        COALESCE((
          SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', x.id,
                    'title', x.title,
                    'img', x.img,
                    'entityKind', 'release',
                    'authors', COALESCE((
                      SELECT jsonb_agg(name ORDER BY name)
                      FROM (
                        SELECT DISTINCT a.name AS name
                        FROM "Release_artists" ra
                        JOIN "Authors" a ON a.id = ra.author_id
                        WHERE ra.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_producers" rp
                        JOIN "Authors" a ON a.id = rp.author_id
                        WHERE rp.release_id = x.id

                        UNION
                        SELECT DISTINCT a.name AS name
                        FROM "Release_designers" rd
                        JOIN "Authors" a ON a.id = rd.author_id
                        WHERE rd.release_id = x.id
                      ) names
                    ), '[]'::jsonb)
                  )
                  ORDER BY x.title
                )
          FROM (
            SELECT DISTINCT r.id, r.title, r.img
            FROM "Release_designers" rd
            JOIN "Releases" r ON r.id = rd.release_id
            JOIN "Release_types" rt ON rt.id = r.release_type_id
            WHERE r.publish_date::date BETWEEN p.start_date AND p.end_date
              AND rt.type IN ('Альбом', 'Трек')
          ) x
        ), '[]'::jsonb) AS "coverCandidates",

        COALESCE((
          SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', x.id,
                    'name', x.name,
                    'img', x.img,
                    'entityKind', 'author'
                  )
                  ORDER BY x.name
                )
          FROM (
            SELECT DISTINCT a.id, a.name, a.avatar_img AS img
            FROM "Release_artists" ra
            JOIN "Releases" r ON r.id = ra.release_id
            JOIN "Authors"  a ON a.id = ra.author_id
            WHERE r.publish_date::date BETWEEN p.start_date AND p.end_date
          ) x
        ), '[]'::jsonb) AS "artistCandidates",

        COALESCE((
          SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', x.id,
                    'name', x.name,
                    'img', x.img,
                    'entityKind', 'author'
                  )
                  ORDER BY x.name
                )
          FROM (
            SELECT DISTINCT a.id, a.name, a.avatar_img AS img
            FROM "Release_producers" rp
            JOIN "Releases" r ON r.id = rp.release_id
            JOIN "Authors"  a ON a.id = rp.author_id
            WHERE r.publish_date::date BETWEEN p.start_date AND p.end_date
          ) x
        ), '[]'::jsonb) AS "producerCandidates"
      FROM period p;
    `;

    const [result] =
      await this.prisma.$queryRawUnsafe<FindNominationCandidatesResponseDto[]>(
        rawQuery,
      );

    return result;
  }
}
