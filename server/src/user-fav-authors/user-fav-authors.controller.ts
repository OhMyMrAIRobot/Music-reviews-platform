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
import { UserFavAuthorsService } from './user-fav-authors.service';

@Controller('user-fav-authors')
export class UserFavAuthorsController {
  constructor(private readonly userFavAuthorsService: UserFavAuthorsService) {}

  /**
   * POST /user-fav-authors/:authorId
   *
   * Adds an author to the authenticated user's favorites.
   * Requires authentication.
   */
  @Post(':authorId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('authorId') authorId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavAuthorsService.create(authorId, req.user.id);
  }

  /**
   * DELETE /user-fav-authors/:authorId
   *
   * Removes an author from the authenticated user's favorites.
   * Requires authentication.
   */
  @Delete(':authorId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('authorId') authorId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavAuthorsService.remove(authorId, req.user.id);
  }
}
