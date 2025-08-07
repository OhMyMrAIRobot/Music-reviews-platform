import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Controller('user-fav-reviews')
export class UserFavReviewsController {
  constructor(private readonly userFavReviewsService: UserFavReviewsService) {}

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.userFavReviewsService.findByUserId(userId);
  }

  @Get('review/:reviewId')
  findByReviewId(@Param('reviewId') reviewId: string) {
    return this.userFavReviewsService.findByReviewId(reviewId);
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
  @Delete('reviewId')
  remove(
    @Request() req: IAuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.userFavReviewsService.remove(reviewId, req.user.id);
  }
}
