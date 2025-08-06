import { Controller, Get, Param } from '@nestjs/common';
import { AuthorTypesService } from './author-types.service';

@Controller('author-types')
export class AuthorTypesController {
  constructor(private readonly authorTypesService: AuthorTypesService) {}

  @Get()
  findAll() {
    return this.authorTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorTypesService.findOne(id);
  }
}
