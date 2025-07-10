import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
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
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.profilesService.updateByUserId(req.user.id, updateProfileDto);
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

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  deleteAvatar(@Request() req: IAuthenticatedRequest) {
    return this.profilesService.updateByUserId(req.user.id, {
      avatar: '',
    });
  }

  @Delete('cover')
  @UseGuards(JwtAuthGuard)
  deleteCover(@Request() req: IAuthenticatedRequest) {
    return this.profilesService.updateByUserId(req.user.id, {
      coverImage: '',
    });
  }

  @Delete(':userId/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminDeleteAvatar(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    return this.profilesService.adminUpdate(req, userId, {
      avatar: '',
    });
  }

  @Delete(':userId/cover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminDeleteCover(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    return this.profilesService.adminUpdate(req, userId, {
      coverImage: '',
    });
  }
}
