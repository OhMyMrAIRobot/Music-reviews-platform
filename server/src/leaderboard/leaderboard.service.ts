import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LeaderboardItemDto } from './dto/leaderboard-item.dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(): Promise<LeaderboardItemDto[]> {
    const rawQuery = `
			select * from leaderboard_summary
		`;
    return this.prisma.$queryRawUnsafe<LeaderboardItemDto[]>(rawQuery);
  }
}
