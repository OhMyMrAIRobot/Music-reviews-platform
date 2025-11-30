import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserFavReleasesService } from './user-fav-releases.service';

@Controller('user-fav-releases')
export class UserFavReleasesController {
  constructor(
    private readonly userFavReleasesService: UserFavReleasesService,
  ) {}

  /**
   * POST /user-fav-releases/:releaseId
   *
   * Adds a release to the authenticated user's favorites.
   * Requires authentication.
   */
  @Post(':releaseId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('releaseId') releaseId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavReleasesService.create(releaseId, req.user.id);
  }

  /**
   * DELETE /user-fav-releases/:releaseId
   *
   * Removes a release from the authenticated user's favorites.
   * Requires authentication.
   */
  @Delete(':releaseId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('releaseId') releaseId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavReleasesService.remove(releaseId, req.user.id);
  }
}
