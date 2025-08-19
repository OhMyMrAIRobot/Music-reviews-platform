import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import {
  FindNominationWinnersResponseDto,
  NominationMonthWinnerItemDto,
} from './dto/response/find-nomination-winners.response.dto';

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
}
