import { Controller, Get, Param } from '@nestjs/common';
import { SocialMediaService } from './social-media.service';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Get()
  findAll() {
    return this.socialMediaService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.socialMediaService.findById(id);
  }
}
