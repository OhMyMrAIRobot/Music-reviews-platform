import { Controller, Get } from '@nestjs/common';
import { ReleaseMediaTypesService } from './release-media-types.service';

@Controller('release-media-types')
export class ReleaseMediaTypesController {
  constructor(
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
  ) {}

  /**
   * GET /release-media-types
   *
   * Returns a list of all available release media types.
   *
   * @returns Promise<ReleaseMediaType[]> - array of media types
   */
  @Get()
  findAll() {
    return this.releaseMediaTypesService.findAll();
  }
}
