import { Controller, Get, Param } from '@nestjs/common';
import { ReleaseLyricsService } from './release-lyrics.service';

@Controller('lyrics')
export class ReleaseLyricsController {
  constructor(private readonly releaseLyricsService: ReleaseLyricsService) {}

  /**
   * GET /lyrics/:releaseId
   * Returns lyrics for the given release id. Delegates to ReleaseLyricsService.findOne.
   *
   * @param {string} releaseId - Release id from route params
   * @returns The lyrics record
   */
  @Get(':releaseId')
  findOne(@Param('releaseId') releaseId: string) {
    return this.releaseLyricsService.findOne(releaseId);
  }
}
