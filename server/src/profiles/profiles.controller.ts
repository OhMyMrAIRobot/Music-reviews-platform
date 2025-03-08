import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from '@prisma/client';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<UserProfile[]> {
    return this.profilesService.findAll();
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string): Promise<UserProfile> {
    return this.profilesService.findByUserId(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    if (!updateProfileDto || Object.keys(updateProfileDto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    return this.profilesService.updateByUserId(userId, updateProfileDto);
  }
}
