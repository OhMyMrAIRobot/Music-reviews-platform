import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LeaderboardScheduler {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshTopUsers() {
    try {
      await this.prisma.$executeRaw`SELECT refresh_top_users()`;
      console.log('Leaderboard refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh leaderboard', error);
    }
  }
}
