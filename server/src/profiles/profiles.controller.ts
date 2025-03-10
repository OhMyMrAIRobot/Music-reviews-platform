import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string): Promise<UserProfile> {
    return this.profilesService.findByUserId(userId);
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
