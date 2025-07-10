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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from '../../auth/types/authenticated-request.interface';
import { AdminCreateSocialMediaDto } from '../dto/admin-create-social-media.dto';
import { CreateProfileSocialMediaDto } from '../dto/create-profile-social-media.dto';
import { UpdateProfileSocialMediaDto } from '../dto/update-profile-social-media.dto';
import { ProfileSocialMediaService } from '../services/profile-social-media.service';

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
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createDto: CreateProfileSocialMediaDto,
  ) {
    return this.profileSocialMediaService.create(req.user.id, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':socialId')
  update(
    @Request() req: IAuthenticatedRequest,
    @Param('socialId') socialId: string,
    @Body() updateDto: UpdateProfileSocialMediaDto,
  ) {
    return this.profileSocialMediaService.update(
      socialId,
      req.user.id,
      updateDto,
    );
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
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
    @Body() createDto: AdminCreateSocialMediaDto,
  ) {
    return this.profileSocialMediaService.adminCreate(
      req,
      userId,
      socialId,
      createDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch(':userId/:socialId')
  adminUpdate(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
    @Body() updateDto: UpdateProfileSocialMediaDto,
  ) {
    return this.profileSocialMediaService.adminUpdate(
      req,
      userId,
      socialId,
      updateDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':userId/:socialId')
  adminDelete(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
    @Param('socialId') socialId: string,
  ) {
    return this.profileSocialMediaService.adminDelete(req, userId, socialId);
  }
}
