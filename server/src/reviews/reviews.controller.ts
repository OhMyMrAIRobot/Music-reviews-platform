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
import { ReleaseReviewParamsDto } from './dto/release-review-params.dto';
import { ReleaseReviewQueryDto } from './dto/release-review-query.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
  @Patch(':id')
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() updateReviewDto: UpdateReviewDto,
    @Param('id') id: string,
  ) {
    return this.reviewsService.update(id, updateReviewDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: IAuthenticatedRequest, @Param('id') id: string) {
    return this.reviewsService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get()
  findAll(@Query() query: ReviewsQueryDto) {
    return this.reviewsService.findAll(query);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId/:id')
  updateById(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':userId/:id')
  adminDelete(@Param('id') id: string, @Param('userId') userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
