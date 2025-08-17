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
import { FindAuthorLikesQuery } from './dto/query/find-author-likes.query.dto';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Controller('user-fav-reviews')
export class UserFavReviewsController {
  constructor(private readonly userFavReviewsService: UserFavReviewsService) {}

  @Get('reviews/:reviewId')
  findByReviewId(@Param('reviewId') reviewId: string) {
    return this.userFavReviewsService.findByReviewId(reviewId);
  }

  @Get('author-likes')
  findAuthorLikes(@Query() query: FindAuthorLikesQuery) {
    return this.userFavReviewsService.findAuthorLikes(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId')
  create(
    @Request() req: IAuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.userFavReviewsService.create(reviewId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  remove(
    @Request() req: IAuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.userFavReviewsService.remove(reviewId, req.user.id);
  }
}
