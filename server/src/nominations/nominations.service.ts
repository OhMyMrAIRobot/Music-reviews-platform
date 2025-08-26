import { BadRequestException, Injectable } from '@nestjs/common';
import { NominationVote } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesEnum } from 'src/author-types/entities/author-types.enum';
import { AuthorsService } from 'src/authors/authors.service';
import { NominationTypesService } from 'src/nomination-types/nomination-types.service';
import { ReleasesService } from 'src/releases/releases.service';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import { AddNominationVoteRequestDto } from './dto/request/add-nomination-vote.request.dto';
import { FindNominationCandidatesResponseDto } from './dto/response/find-nomination-candidates.response.dto';
import {
  FindNominationWinnersResponseDto,
  NominationMonthWinnerItemDto,
} from './dto/response/find-nomination-winners.response.dto';
import { FindNominationWinnersByAuthorIdResponseDto } from './dto/response/find-nominations-winners-by-author-id.response.dto';
import { NominationUserVoteResponseDto } from './dto/response/nomination-user-vote.response.dto';
import { NominationPeriod } from './types/nomination-period.type';

@Injectable()
export class NominationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nominationTypesService: NominationTypesService,
    private readonly releasesService: ReleasesService,
    private readonly authorsService: AuthorsService,
  ) {}

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

  async addNominationVote(
    dto: AddNominationVoteRequestDto,
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
