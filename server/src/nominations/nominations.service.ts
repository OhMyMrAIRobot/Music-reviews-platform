import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
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
}
