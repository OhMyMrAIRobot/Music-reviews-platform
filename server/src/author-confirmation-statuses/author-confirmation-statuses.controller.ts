import { Controller, Get, Param } from '@nestjs/common';
import { AuthorConfirmationStatusesService } from './author-confirmation-statuses.service';

@Controller('author-request-statuses')
export class AuthorConfirmationStatusesController {
  constructor(
    private readonly authorConfirmationStatusesService: AuthorConfirmationStatusesService,
  ) {}

  @Get()
  findAll() {
    return this.authorConfirmationStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorConfirmationStatusesService.findOne(id);
  }
}
