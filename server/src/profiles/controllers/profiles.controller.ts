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
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IAuthenticatedRequest } from '../../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../../roles/types/user-role.enum';
import { FindProfileParamsDto } from '../dto/find-profile-params.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfilesService } from '../services/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string): Promise<UserProfile> {
    return this.profilesService.findByUserId(userId);
  }

  @Get('user/:id')
  async findByUserIdExtended(@Param() params: FindProfileParamsDto) {
    return this.profilesService.findByUserIdExtended(params.id);
  }

  @Get('preferred/:id')
  async findPreferred(@Param() params: FindProfileParamsDto) {
    return this.profilesService.findPreferred(params.id);
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
  @Get()
  findAll(): Promise<UserProfile[]> {
    return this.profilesService.findAll();
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
