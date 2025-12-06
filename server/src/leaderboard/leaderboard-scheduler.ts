import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LeaderboardScheduler {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Scheduler that refreshes the leaderboard aggregates periodically.
   *
   * Runs every 10 minutes and invokes the database-side function
   * `refresh_top_users()` which recalculates leaderboard tables/metrics.
   * Any errors are logged but do not crash the scheduler.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshTopUsers() {
    const sql = Prisma.sql`
      SELECT refresh_top_users()
    `;

    try {
      await this.prisma.$executeRaw(sql);
      console.log('Leaderboard refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh leaderboard', error);
    }
  }
}
