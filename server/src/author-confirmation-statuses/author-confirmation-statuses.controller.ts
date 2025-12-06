import { Controller, Get, Param } from '@nestjs/common';
import { AuthorConfirmationStatusesService } from './author-confirmation-statuses.service';

@Controller('author-confirmation-statuses')
export class AuthorConfirmationStatusesController {
  constructor(
    private readonly authorConfirmationStatusesService: AuthorConfirmationStatusesService,
  ) {}

  /**
   * GET /author-confirmation-statuses
   *
   * Returns all available author confirmation statuses.
   *
   * @returns Promise<AuthorConfirmationStatus[]>
   */
  @Get()
  findAll() {
    return this.authorConfirmationStatusesService.findAll();
  }

  /**
   * GET /author-confirmation-statuses/:id
   *
   * Returns a single author confirmation status by id. If the id does
   * not exist, the service will throw `EntityNotFoundException` which is
   * mapped to a 404 response.
   *
   * @param id - status entity id
   * @returns Promise<AuthorConfirmationStatus>
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorConfirmationStatusesService.findOne(id);
  }
}
