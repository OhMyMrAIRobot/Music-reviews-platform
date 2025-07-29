import { Controller, Get, Param } from '@nestjs/common';
import { ReleaseMediaTypesService } from './release-media-types.service';

@Controller('release-media-types')
export class ReleaseMediaTypesController {
  constructor(
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
  ) {}

  @Get()
  findAll() {
    return this.releaseMediaTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseMediaTypesService.findOne(id);
  }
}
