import { Controller, Get, Param } from '@nestjs/common';
import { AuthorRequestStatusesService } from './author-request-statuses.service';

@Controller('author-request-statuses')
export class AuthorRequestStatusesController {
  constructor(
    private readonly authorRequestStatusesService: AuthorRequestStatusesService,
  ) {}

  @Get()
  findAll() {
    return this.authorRequestStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorRequestStatusesService.findOne(id);
  }
}
