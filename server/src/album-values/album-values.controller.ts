import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumValuesService } from './album-values.service';
import { FindAlbumValueByReleaseIdParams } from './dto/request/params/find-album-value-by-release-id.params.dto';
import { FindAlbumValuesQuery } from './dto/request/query/find-album-values.query.dto';

@Controller('album-values')
export class AlbumValuesController {
  constructor(private readonly albumValuesService: AlbumValuesService) {}

  @Get(':releaseId')
  findOne(@Param() params: FindAlbumValueByReleaseIdParams) {
    return this.albumValuesService.findOne(params.releaseId);
  }

  @Get()
  findAll(@Query() query: FindAlbumValuesQuery) {
    return this.albumValuesService.findAll(query);
  }
}
