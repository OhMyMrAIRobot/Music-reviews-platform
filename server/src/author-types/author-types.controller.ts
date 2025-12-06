import { Controller, Get, Param } from '@nestjs/common';
import { AuthorTypesService } from './author-types.service';

@Controller('author-types')
export class AuthorTypesController {
  constructor(private readonly authorTypesService: AuthorTypesService) {}

  /**
   * GET /author-types
   *
   * Returns a list of all available author types.
   *
   * @returns Promise<AuthorType[]>
   */
  @Get()
  findAll() {
    return this.authorTypesService.findAll();
  }

  /**
   * GET /author-types/:id
   *
   * Returns a single author type by id. If the id does not exist the
   * service will throw `EntityNotFoundException` which is mapped to a
   * 404 response.
   *
   * @param id - author type entity id
   * @returns Promise<AuthorType>
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorTypesService.findOne(id);
  }
}
