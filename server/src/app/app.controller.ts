import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /stats
   *
   * Return aggregated platform counters.
   *
   * This endpoint delegates to `AppService.getPlatformStats()` and returns
   * a `PlatformStatsResponseDto` containing counts such as total users,
   * registered authors, total albums/tracks, and review counts.
   */
  @Get('stats')
  getPlatformStats() {
    return this.appService.getPlatformStats();
  }
}
