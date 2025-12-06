import { Controller, Get, Param } from '@nestjs/common';
import { NominationTypesService } from './nomination-types.service';

@Controller('nomination-types')
export class NominationTypesController {
  constructor(
    private readonly nominationTypesService: NominationTypesService,
  ) {}

  /**
   * GET /nomination-types/:id
   *
   * Returns a single nomination type by id. If the id does not exist the
   * service will throw `EntityNotFoundException` which is translated to
   * a 404 response.
   *
   * @param id - nomination type entity id
   * @returns Promise<NominationType>
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nominationTypesService.findOne(id);
  }

  /**
   * GET /nomination-types
   *
   * Returns all nomination types available in the system. Used by
   * leaderboards and admin interfaces to list categories.
   *
   * @returns Promise<NominationType[]>
   */
  @Get()
  findAll() {
    return this.nominationTypesService.findAll();
  }
}
