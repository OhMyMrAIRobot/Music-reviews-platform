import { Controller, Get, Param } from '@nestjs/common';
import { NominationTypesService } from './nomination-types.service';

@Controller('nomination-types')
export class NominationTypesController {
  constructor(
    private readonly nominationTypesService: NominationTypesService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nominationTypesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.nominationTypesService.findAll();
  }
}
