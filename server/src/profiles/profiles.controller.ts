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
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { UpdateProfileRequestDto } from './dto/request/update-profile.request.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * GET /profiles/user/:userId
   *
   * Return the profile payload for the specified user.
   *
   * @param userId Unique identifier of the user whose profile should be returned
   * @returns `ProfileDto` with nested user info, socials and stats
   */
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  /**
   * GET /profiles/user/:userId/preferences
   *
   * Return the preferences (favorite artists/producers/tracks/albums)
   * for the provided user.
   *
   * @param userId User id to retrieve preferences for
   * @returns `ProfilePreferencesResponseDto` grouping preferences by category
   */
  @Get('user/:userId/preferences')
  async getPreferences(@Param('userId') userId: string) {
    return this.profilesService.findProfilePreferences(userId);
  }

  /**
   * PATCH /profiles
   *
   * Update the authenticated user's profile.
   *
   * Accepts optional multipart file fields `avatarImg` and `coverImg` and
   * an update DTO. If files are provided they will be saved and replaced
   * existing images; if `clearAvatar` or `clearCover` flags are set the
   * corresponding images are removed.
   *
   * @param req Authenticated request (used to obtain `user.id`)
   * @param dto Partial profile update DTO
   * @param files Optional uploaded files for avatar and cover images
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
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
  ) {
    return this.profilesService.updateByUserId(
      req.user.id,
      dto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  /**
   * PATCH /profiles/user/:userId
   *
   * Administrative profile update endpoint.
   *
   * Requires the caller to have `ADMIN` or `ROOT_ADMIN` role and
   * delegates to the service's admin update flow which enforces
   * permission checks and performs the update.
   *
   * @param req Authenticated request of the admin performing the update
   * @param userId Target user id whose profile will be updated
   * @param dto Partial profile update DTO
   */
  @Patch('user/:userId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateByUserId(
    @Request() req: IAuthenticatedRequest,
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    return this.profilesService.adminUpdate(req, userId, dto);
  }
}
