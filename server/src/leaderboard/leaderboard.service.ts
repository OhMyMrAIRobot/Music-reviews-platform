import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LeaderboardItemDto } from './dto/leaderboard-item.dto';
import { FindLeaderboardQuery } from './dto/query/find-leaderboard.query.dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(
    query: FindLeaderboardQuery,
  ): Promise<LeaderboardItemDto[]> {
    const { limit, offset = 0 } = query;
    const rawQuery = `
			SELECT * 
      FROM leaderboard_summary 
      ${limit !== undefined ? `LIMIT ${limit}` : ''}
      OFFSET ${offset}
		`;
    return this.prisma.$queryRawUnsafe<LeaderboardItemDto[]>(rawQuery);
  }
}
