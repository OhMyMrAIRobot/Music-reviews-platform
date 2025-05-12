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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { AuthorReviewsParamsDto } from './dto/author-reviews-params.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReleaseReviewParamsDto } from './dto/release-review-params.dto';
import { ReleaseReviewQueryDto } from './dto/release-review-query.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('release/:id')
  findByReleaseId(
    @Param() params: ReleaseReviewParamsDto,
    @Query() query: ReleaseReviewQueryDto,
  ) {
    return this.reviewsService.findByReleaseId(params.id, query);
  }

  @Get('author/:id')
  findByAuthorId(@Param() params: AuthorReviewsParamsDto) {
    return this.reviewsService.findByAuthorId(params.id);
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.reviewsService.findByUserId(id);
  }

  @Get('list')
  findReleases(@Query() query: ReviewsQueryDto) {
    return this.reviewsService.findReviews(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(updateReviewDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Request() req: IAuthenticatedRequest,
    @Body() deleteReviewDto: DeleteReviewDto,
  ) {
    return this.reviewsService.remove(deleteReviewDto, req.user.id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId')
  updateById(
    @Param('userId') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(updateReviewDto, userId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':userId')
  removeById(
    @Param('userId') userId: string,
    @Body() deleteReviewDto: DeleteReviewDto,
  ) {
    return this.reviewsService.remove(deleteReviewDto, userId);
  }
}
