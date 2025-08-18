import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import { FindNominationWinnersResponseDto } from './dto/response/find-nomination-winners.response.dto';

@Injectable()
export class NominationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findNominationWinners(
    query: FindNominationWinnersQueryDto,
  ): Promise<FindNominationWinnersResponseDto[]> {
    const { year, month } = query;
    const rawQuery = `
			SELECT * FROM "Nomination_winners_monthly_json"
			WHERE 1=1 ${year !== undefined ? ` AND year=${year}` : ''} ${month !== undefined ? `AND month=${month}` : ''}
			ORDER BY month
		`;

    return this.prisma.$queryRawUnsafe<FindNominationWinnersResponseDto[]>(
      rawQuery,
    );
  }
}
