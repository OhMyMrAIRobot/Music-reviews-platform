import { Controller, Get, Param } from '@nestjs/common';
import { SocialMediaService } from './social-media.service';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  /**
   * GET /social-media
   *
   * Returns a list of all supported social media records.
   *
   * @returns Promise<SocialMedia[]>
   */
  @Get()
  findAll() {
    return this.socialMediaService.findAll();
  }

  /**
   * GET /social-media/:id
   *
   * Returns a single social media record by id. If the record does not
   * exist, the service will throw an `EntityNotFoundException` which is
   * translated to a 404 response by the global exception filter.
   *
   * @param id - entity id of the social media record
   * @returns Promise<SocialMedia>
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.socialMediaService.findById(id);
  }
}
