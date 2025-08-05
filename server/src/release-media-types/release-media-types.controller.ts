import { Controller, Get } from '@nestjs/common';
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
}
