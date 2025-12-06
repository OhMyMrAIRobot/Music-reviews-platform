import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AdminCreateReleaseMediaRequestDto } from './dto/request/admin-create-release-media.request.dto';
import { AdminUpdateReleaseMediaRequestDto } from './dto/request/admin-update-release-media.request.dto';
import { ReleaseMediaService } from './release-media.service';

@Controller('admin/release-media')
export class AdminReleaseMediaController {
  constructor(private readonly releaseMediaService: ReleaseMediaService) {}

  /**
   * POST /admin/release-media
   *
   * Admin-only endpoint to create a release media entry. Delegates to the
   * main service but does not attach a `userId`.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminCreate(@Body() dto: AdminCreateReleaseMediaRequestDto) {
    return this.releaseMediaService.create({
      ...dto,
      userId: undefined,
    });
  }

  /**
   * PATCH /admin/release-media/:id
   *
   * Admin-only endpoint to update any media entry. Delegates to
   * `ReleaseMediaService.update` without owner permission constraints.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateReleaseMediaRequestDto,
  ) {
    return this.releaseMediaService.update(id, dto);
  }

  /**
   * DELETE /admin/release-media/:id
   *
   * Admin-only endpoint to delete any media entry. Delegates to the
   * service remove method.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminRemove(@Param('id') id: string) {
    return this.releaseMediaService.remove(id);
  }
}
