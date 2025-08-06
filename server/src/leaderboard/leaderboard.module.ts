import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { LeaderboardScheduler } from './leaderboard-scheduler';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardScheduler],
})
export class LeaderboardModule {}
