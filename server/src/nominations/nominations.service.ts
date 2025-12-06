import { BadRequestException, Injectable } from '@nestjs/common';
import { NominationVote } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesEnum } from 'src/author-types/types/author-types.enum';
import { AuthorsService } from 'src/authors/authors.service';
import { NominationTypesService } from 'src/nomination-types/nomination-types.service';
import { ReleasesService } from 'src/releases/releases.service';
import { NominationWinnersQueryDto } from './dto/query/nomination-winners.query.dto';
import { CreateNominationVoteRequestDto } from './dto/request/create-nomination-vote.request.dto';
import { AuthorNominationWinsResponseDto } from './dto/response/author-nomination-wins.response.dto';
import { FindNominationCandidatesResponseDto } from './dto/response/nomination-candidates.response.dto';
import { NominationUserVoteResponseDto } from './dto/response/nomination-user-vote.response.dto';
import {
  NominationMonthWinnerItemDto,
  NominationWinnersResponseDto,
} from './dto/response/nomination-winners.response.dto';
import { NominationPeriod } from './types/nomination-period.type';

@Injectable()
export class NominationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nominationTypesService: NominationTypesService,
    private readonly releasesService: ReleasesService,
    private readonly authorsService: AuthorsService,
  ) {}

  /**
   * Service method returning nomination winners aggregated by month.
   *
   * The method optionally accepts `year` and `month` filters which are
   * applied directly to the underlying materialized view `Nomination_winners_monthly_json`.
   * It also queries the min/max available years to populate the response
   * meta fields.
   *
   * @param query DTO with optional `year` and `month` filters
   * @returns Winners response containing `minYear`, `maxYear` and `items`
   */
  async findNominationWinners(
    query: NominationWinnersQueryDto,
  ): Promise<NominationWinnersResponseDto> {
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

  /**
   * Validate nomination type existence and the nominated entity's
   * eligibility for the current nomination period, then persist the vote.
   *
   * The method enforces a single vote per user / nomination type / period.
   */
  async createNominationVote(
    dto: CreateNominationVoteRequestDto,
    userId: string,
  ): Promise<NominationUserVoteResponseDto> {
    await this.nominationTypesService.findOne(dto.nominationTypeId);

    const period = this.getNominationPeriodUTC();

    const exist = await this.findOne(
      userId,
      dto.nominationTypeId,
      period.month,
      period.year,
    );

    if (exist) {
      throw new BadRequestException(
        'Вы уже оставляли голос в данной номинации в текущем периоде голосования!',
      );
    }

    if (dto.entityKind === 'release') {
      await this.assertReleaseIsEligible(
        dto.nominationTypeId,
        dto.entityId,
        period,
      );
    } else if (dto.entityKind === 'author') {
      await this.assertAuthorIsEligible(
        dto.nominationTypeId,
        dto.entityId,
        period,
      );
    } else {
      throw new BadRequestException('Неподдерживаемый тип сущности!');
    }

    const created = await this.prisma.nominationVote.create({
      data: {
        userId,
        nominationTypeId: dto.nominationTypeId,
        month: period.month,
        year: period.year,
        releaseId: dto.entityKind === 'release' ? dto.entityId : null,
        authorId: dto.entityKind === 'author' ? dto.entityId : null,
      },
      include: {
        nominationType: true,
      },
    });

    return plainToInstance(NominationUserVoteResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Return nomination participations/wins for a single author.
   *
   * The method queries a precomputed/enriched JSON view that contains
   * nomination participations. If no records are found an empty
   * response object is returned.
   *
   * @param authorId Author id to lookup
   * @returns Author nominations payload with an empty `nominations`
   *   array when no participations are found.
   */
  async findAuthorNominationWins(
    authorId: string,
  ): Promise<AuthorNominationWinsResponseDto> {
    const rawQuery = `
      SELECT *
      FROM "Nomination_winner_participations_enriched_json"
      WHERE "authorId" = '${authorId}'
    `;

    const data =
      await this.prisma.$queryRawUnsafe<AuthorNominationWinsResponseDto[]>(
        rawQuery,
      );

    if (data.length === 0) {
      return {
        authorId,
        nominations: [],
      };
    }

    return data[0];
  }

  /**
   * Return votes placed by the specified user during the current
   * nomination period.
   *
   * The method calculates the active nomination period (previous
   * month in UTC) and queries the `NominationVote` table for votes
   * matching the user and period. The result is transformed into
   * `NominationUserVoteResponseDto` instances.
   *
   * @param userId User unique identifier
   * @returns Array of the user's nomination votes for the current period
   */
  async findUserVotes(
    userId: string,
  ): Promise<NominationUserVoteResponseDto[]> {
    const period = this.getNominationPeriodUTC();

    const votes = await this.prisma.nominationVote.findMany({
      where: {
        userId,
        month: period.month,
        year: period.year,
      },
      include: {
        nominationType: true,
      },
    });

    return plainToInstance(NominationUserVoteResponseDto, votes, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find a single NominationVote by its compound unique key
   * (userId, nominationTypeId, year, month).
   *
   * Used to enforce one-vote-per-user-per-nomination-per-period.
   *
   * @returns The found `NominationVote` or `null` when not present.
   */
  async findOne(
    userId: string,
    nominationTypeId: string,
    month: number,
    year: number,
  ): Promise<NominationVote | null> {
    return this.prisma.nominationVote.findUnique({
      where: {
        userId_nominationTypeId_year_month: {
          userId,
          nominationTypeId,
          year,
          month,
        },
      },
    });
  }

  /**
   * Build and return nomination candidate lists for the current
   * nomination period.
   *
   * The method executes a raw SQL query that collects candidate
   * releases and authors grouped by nomination categories and
   * returns a single DTO describing the period and candidate arrays.
   *
   * @returns Candidate lists and period metadata for the previous month
   */
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

  /**
   * Compute the active nomination period in UTC.
   *
   * The nomination window is defined as the previous calendar month
   * relative to the current UTC date. The method returns the year,
   * month (1-12) and `start`/`nextMonthStart` Date objects that can be
   * used to compare publish dates.
   *
   * @returns NominationPeriod for the previous month in UTC
   */
  private getNominationPeriodUTC(): NominationPeriod {
    const now = new Date();
    const currentMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    const previousMonthStart = new Date(
      Date.UTC(
        currentMonthStart.getUTCFullYear(),
        currentMonthStart.getUTCMonth() - 1,
        1,
      ),
    );
    const year = previousMonthStart.getUTCFullYear();
    const month = previousMonthStart.getUTCMonth() + 1;

    return {
      year,
      month,
      start: previousMonthStart,
      nextMonthStart: currentMonthStart,
    };
  }

  /**
   * Ensure the release exists, its publish date falls inside the
   * nomination period and its release type is allowed for the
   * nomination type.
   *
   * Throws a `BadRequestException` when the checks fail.
   */
  private async assertReleaseIsEligible(
    nominationTypeId: string,
    releaseId: string,
    period: NominationPeriod,
  ) {
    const release = await this.releasesService.findOne(releaseId);

    if (
      !(
        release.publishDate >= period.start &&
        release.publishDate < period.nextMonthStart
      )
    ) {
      throw new BadRequestException(
        'Дата публикации релиза не соответствует периоду голосования!',
      );
    }

    const allowed =
      await this.prisma.nominationTypeAllowedReleaseType.findFirst({
        where: {
          nominationTypeId,
          releaseTypeId: release.releaseTypeId,
        },
        select: { nominationTypeId: true },
      });

    if (!allowed) {
      throw new BadRequestException('Тип релиза не соответсвует номинации!');
    }
  }

  /**
   * Check that the author exists and has at least one release in the
   * nomination period matching allowed author types (artist, producer,
   * designer) for the nomination type.
   *
   * Throws `BadRequestException` when the author is not eligible.
   */
  private async assertAuthorIsEligible(
    nominationTypeId: string,
    authorId: string,
    period: NominationPeriod,
  ) {
    await this.authorsService.findOne(authorId);

    const allowedTypes =
      await this.prisma.nominationTypeAllowedAuthorType.findMany({
        where: { nominationTypeId },
        select: {
          authorType: { select: { type: true } },
        },
      });

    if (allowedTypes.length === 0) {
      throw new BadRequestException('Тип автора не соответсвует номинации!');
    }

    const allowedTypeNames = new Set(
      allowedTypes.map((x) => x.authorType.type),
    );

    const checks: Promise<{ id: string } | null>[] = [];

    if (allowedTypeNames.has(AuthorTypesEnum.ARTIST)) {
      checks.push(
        this.prisma.release.findFirst({
          where: {
            publishDate: { gte: period.start, lt: period.nextMonthStart },
            releaseArtist: { some: { authorId } },
          },
          select: { id: true },
        }),
      );
    }
    if (allowedTypeNames.has(AuthorTypesEnum.PRODUCER)) {
      checks.push(
        this.prisma.release.findFirst({
          where: {
            publishDate: { gte: period.start, lt: period.nextMonthStart },
            releaseProducer: { some: { authorId } },
          },
          select: { id: true },
        }),
      );
    }
    if (allowedTypeNames.has(AuthorTypesEnum.DESIGNER)) {
      checks.push(
        this.prisma.release.findFirst({
          where: {
            publishDate: { gte: period.start, lt: period.nextMonthStart },
            releaseDesigner: { some: { authorId } },
          },
          select: { id: true },
        }),
      );
    }

    const results = await Promise.all(checks);
    const eligible = results.some((r) => r !== null);

    if (!eligible) {
      throw new BadRequestException('Данный автор не выдвинут на голосование!');
    }
  }
}
