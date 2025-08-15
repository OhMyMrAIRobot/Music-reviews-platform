import { Controller, Get, Query } from '@nestjs/common';
import { FindLeaderboardQuery } from './dto/query/find-leaderboard.query.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard(@Query() query: FindLeaderboardQuery) {
    return this.leaderboardService.getLeaderboard(query);
  }
}
