import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateReviewRequestDto } from './dto/request/create-review.request.dto';
import { ReviewsQueryDto } from './dto/request/query/reviews.query.dto';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * GET /reviews/:id
   *
   * Returns a single review by id. Delegates to `ReviewsService.findById`.
   * If the review is not found the service will throw a EntityNotFoundException.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  /**
   * GET /reviews
   *
   * Returns a paginated list of reviews according to provided query
   * filters. Delegates to `ReviewsService.findAll` which performs the
   * actual filtering/aggregation.
   */
  @Get()
  findAll(@Query() query: ReviewsQueryDto) {
    return this.reviewsService.findAll(query);
  }

  /**
   * POST /reviews
   *
   * Create a new review. Requires an authenticated user. The request body
   * is validated by `CreateReviewRequestDto`. Returns the created review
   * mapped to `ReviewDto`.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() dto: CreateReviewRequestDto,
  ) {
    return this.reviewsService.create(dto, req.user.id);
  }

  /**
   * PATCH /reviews/:id
   *
   * Update an existing review. Requires the authenticated owner of the
   * review. Returns the updated review mapped to `ReviewDto`.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() dto: UpdateReviewRequestDto,
    @Param('id') id: string,
  ) {
    return this.reviewsService.update(id, dto, req.user.id);
  }

  /**
   * DELETE /reviews/:id
   *
   * Delete a review. Requires the authenticated owner of the review.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req: IAuthenticatedRequest, @Param('id') id: string) {
    return this.reviewsService.remove(id, req.user.id);
  }
}
