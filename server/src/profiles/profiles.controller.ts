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
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { FindProfileByUserIdParams } from './dto/request/params/find-profile-by-user-id.params.dto';
import { UpdateProfileRequestDto } from './dto/request/update-profile.request.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  async findByUserId(@Param() params: FindProfileByUserIdParams) {
    return this.profilesService.findByUserIdExtended(params.userId);
  }

  @Get('preferences/:userId')
  async getPreferences(@Param() params: FindProfileByUserIdParams) {
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
    @Body() dto: UpdateProfileRequestDto,
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
  ): Promise<UserProfile> {
    return this.profilesService.updateByUserId(
      req.user.id,
      dto,
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
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<UserProfile> {
    return this.profilesService.adminUpdate(req, userId, dto);
  }
}
