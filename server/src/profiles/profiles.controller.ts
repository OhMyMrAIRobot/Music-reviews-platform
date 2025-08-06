import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserProfile } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { ProfileParamsDto } from './dto/request/profile.params.dto';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  async findByUserId(@Param() params: ProfileParamsDto) {
    return this.profilesService.findByUserIdExtended(params.userId);
  }

  @Get('preferences/:userId')
  async getPreferences(@Param() params: ProfileParamsDto) {
    return this.profilesService.findProfilePreferences(params.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarImg', maxCount: 1 },
      { name: 'coverImg', maxCount: 1 },
    ]),
  )
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
  ): Promise<UserProfile> {
    return this.profilesService.updateByUserId(
      req.user.id,
      updateProfileDto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId')
  updateByUserId(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.profilesService.adminUpdate(req, userId, updateProfileDto);
  }
}
