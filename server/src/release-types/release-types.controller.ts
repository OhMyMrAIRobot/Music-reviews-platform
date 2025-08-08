import { Controller, Get, Param } from '@nestjs/common';
import { ReleaseTypesService } from './release-types.service';

@Controller('release-types')
export class ReleaseTypesController {
  constructor(private readonly releaseTypesService: ReleaseTypesService) {}

  @Get()
  findAll() {
    return this.releaseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseTypesService.findOne(id);
  }
}
