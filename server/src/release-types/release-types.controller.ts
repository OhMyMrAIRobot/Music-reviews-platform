import { Controller, Get, Param } from '@nestjs/common';
import { ReleaseTypesService } from './release-types.service';

@Controller('release-types')
export class ReleaseTypesController {
  constructor(private readonly releaseTypesService: ReleaseTypesService) {}

  /**
   * GET /release-types
   *
   * Returns a list of all release types.
   *
   * @returns Promise<ReleaseType[]> - array of release type records.
   */
  @Get()
  findAll() {
    return this.releaseTypesService.findAll();
  }

  /**
   * GET /release-types/:id
   *
   * Returns a single release type by id. If the requested id does not
   * correspond to an existing release type, the service will throw an
   * `EntityNotFoundException` which is translated to a 404 response.
   *
   * @param id - entity id of the release type
   * @returns Promise<ReleaseType>
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseTypesService.findOne(id);
  }
}
