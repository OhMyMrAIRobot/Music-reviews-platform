import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumValuesService } from './album-values.service';
import { AlbumValuesQueryDto } from './dto/request/query/album-values.query.dto';

@Controller('album-values')
export class AlbumValuesController {
  constructor(private readonly albumValuesService: AlbumValuesService) {}

  /**
   * GET /album-values/:releaseId
   *
   * Return aggregated value information for a single release (album).
   *
   * The endpoint validates that the release exists and returns the computed
   * `AlbumValueDto` for the provided `releaseId`. Throws when the value is
   * not found.
   */
  @Get(':releaseId')
  findOne(@Param('releaseId') releaseId: string) {
    return this.albumValuesService.findOne(releaseId);
  }

  /**
   * GET /album-values
   *
   * List album values with optional filtering, tier selection and pagination.
   *
   * Accepts the query parameters defined in `AlbumValuesQueryDto` and
   * returns a paginated `AlbumValuesResponseDto`.
   */
  @Get()
  findAll(@Query() query: AlbumValuesQueryDto) {
    return this.albumValuesService.findAll(query);
  }
}
