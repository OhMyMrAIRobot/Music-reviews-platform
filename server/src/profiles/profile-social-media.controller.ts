import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateProfileSocialMediaDto } from './dto/create-profile-social-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { ProfileSocialMediaService } from './profile-social-media.service';
import { UpdateProfileSocialMediaDto } from './dto/update-profile-social-media.dto';

@Controller('profile-social-media')
export class ProfileSocialMediaController {
  constructor(
    private readonly profileSocialMediaService: ProfileSocialMediaService,
  ) {}

  @Get(':userId')
  getAllByUserId(@Param('userId') userId: string) {
    return this.profileSocialMediaService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createDto: CreateProfileSocialMediaDto,
  ) {
    return this.profileSocialMediaService.create(req.user.id, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateDto: UpdateProfileSocialMediaDto,
  ) {
    return this.profileSocialMediaService.update(id, req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string
  ) {
    return this.profileSocialMediaService.delete(id, req.user.id);
  }
}
