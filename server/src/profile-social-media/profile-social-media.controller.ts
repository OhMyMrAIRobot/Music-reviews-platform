import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UpdateProfileSocialMediaRequestDto } from 'src/profile-social-media/dto/request/update-profile-social-media.request.dto';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateProfileSocialMediaRequestDto } from './dto/request/create-profile-social-media.request.dto';
import { ProfileSocialMediaService } from './profile-social-media.service';

@Controller('profile-social-media')
export class ProfileSocialMediaController {
  constructor(
    private readonly profileSocialMediaService: ProfileSocialMediaService,
  ) {}

  @Get(':userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.profileSocialMediaService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':socialId')
  create(
    @Param('socialId') socialId: string,
    @Body() dto: CreateProfileSocialMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profileSocialMediaService.create(req.user.id, socialId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':socialId')
  update(
    @Param('socialId') socialId: string,
    @Body() dto: UpdateProfileSocialMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profileSocialMediaService.update(socialId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':socialId')
  delete(
    @Request() req: IAuthenticatedRequest,
    @Param('socialId') socialId: string,
  ) {
    return this.profileSocialMediaService.delete(socialId, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Post(':userId/:socialId')
  adminCreate(
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
    @Body() dto: CreateProfileSocialMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profileSocialMediaService.adminCreate(
      req,
      userId,
      socialId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch(':userId/:socialId')
  adminUpdate(
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
    @Body() dto: UpdateProfileSocialMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profileSocialMediaService.adminUpdate(
      req,
      userId,
      socialId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':userId/:socialId')
  adminDelete(
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profileSocialMediaService.adminDelete(req, userId, socialId);
  }
}
