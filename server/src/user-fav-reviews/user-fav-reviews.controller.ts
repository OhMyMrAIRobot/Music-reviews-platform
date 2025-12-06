import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthorLikeQueryDto } from './dto/query/author-like.query.dto';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Controller('user-fav-reviews')
export class UserFavReviewsController {
  constructor(private readonly userFavReviewsService: UserFavReviewsService) {}
  /**
   * POST /user-fav-reviews/:reviewId
   *
   * Mark the authenticated user's review as a favourite. Requires a valid
   * JWT token. The service enforces business rules (cannot favourite own
   * review, review must have text/title, and duplicates are prevented).
   */
  @Post(':reviewId')
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: IAuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.userFavReviewsService.create(reviewId, req.user.id);
  }

  /**
   * DELETE /user-fav-reviews/:reviewId
   *
   * Remove a previously created favourite relation for the authenticated user.
   * Requires authentication and will return a conflict error when the
   * favourite does not exist.
   */
  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Request() req: IAuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.userFavReviewsService.remove(reviewId, req.user.id);
  }

  /**
   * GET /user-fav-reviews/author-likes
   *
   * Return a paginated list of author-like records. This endpoint is public
   * and delegates pagination to `AuthorLikeQueryDto`. The response contains
   * `items` and `meta` fields matching `AuthorLikesResponseDto`.
   */
  @Get('author-likes')
  findAuthorLikes(@Query() query: AuthorLikeQueryDto) {
    return this.userFavReviewsService.findAuthorLikes(query);
  }
}
