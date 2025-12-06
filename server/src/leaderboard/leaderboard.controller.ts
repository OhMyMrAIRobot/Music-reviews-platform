import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardQueryDto } from './dto/query/leaderboard.query.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  /**
   * GET /leaderboard
   *
   * Return a page of leaderboard items. Accepts pagination parameters
   * via `LeaderboardQueryDto`.
   *
   * @param query Provided query parameters
   * @returns Array of `LeaderboardItemDto` items
   */
  @Get()
  getLeaderboard(@Query() query: LeaderboardQueryDto) {
    return this.leaderboardService.getLeaderboard(query);
  }
}
