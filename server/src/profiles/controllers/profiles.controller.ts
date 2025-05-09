import {
  Body,
  Controller,
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

  @Get('one/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<UserProfile> {
    return this.profilesService.findByUserId(userId);
  }

  @Get('user/:id')
  async findByUserIdExtended(@Param() params: FindProfileParamsDto) {
    return this.profilesService.findByUserIdExtended(params.id);
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
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.profilesService.updateByUserId(userId, updateProfileDto);
  }
}
