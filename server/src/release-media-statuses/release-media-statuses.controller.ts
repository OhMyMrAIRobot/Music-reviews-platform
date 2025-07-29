import { Controller, Get, Param } from '@nestjs/common';
import { ReleaseMediaStatusesService } from './release-media-statuses.service';

@Controller('release-media-statuses')
export class ReleaseMediaStatusesController {
  constructor(
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
  ) {}

  @Get()
  findAll() {
    return this.releaseMediaStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseMediaStatusesService.findOne(id);
  }
}
