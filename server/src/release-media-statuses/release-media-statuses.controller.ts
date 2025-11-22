import { Controller, Get } from '@nestjs/common';
import { ReleaseMediaStatusesService } from './release-media-statuses.service';

@Controller('release-media-statuses')
export class ReleaseMediaStatusesController {
  constructor(
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
  ) {}

  /**
   * GET /release-media-statuses
   *
   * Returns a list of media statuses.
   *
   * @returns Promise<ReleaseMediaStatus[]> - array of media statuses
   */
  @Get()
  findAll() {
    return this.releaseMediaStatusesService.findAll();
  }
}
