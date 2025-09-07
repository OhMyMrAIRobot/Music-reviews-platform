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
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateReviewRequestDto } from './dto/request/create-review.request.dto';
import { FindReviewsByAuthorIdParams } from './dto/request/params/find-reviews-by-author-id.params.dto';
import { FindReviewsByReleaseIdParams } from './dto/request/params/find-reviews-by-release-id.params.dto';
import { FindReviewsByAuthorIdQuery } from './dto/request/query/find-reviews-by-author-id.query.dto';
import { FindReviewsByReleaseIdQuery } from './dto/request/query/find-reviews-by-release-id.query.dto';
import { FindReviewsQuery } from './dto/request/query/find-reviews.query.dto';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findReleases(@Query() query: FindReviewsQuery) {
    return this.reviewsService.findReviews(query);
  }

  @Get('release/:releaseId')
  findByReleaseId(
    @Param() params: FindReviewsByReleaseIdParams,
    @Query() query: FindReviewsByReleaseIdQuery,
  ) {
    return this.reviewsService.findByReleaseId(params.releaseId, query);
  }

  @Get('author/:authorId')
  findByAuthorId(
    @Param() params: FindReviewsByAuthorIdParams,
    @Query() query: FindReviewsByAuthorIdQuery,
  ) {
    return this.reviewsService.findByAuthorId(params.authorId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/release/:releaseId')
  findByUserReleaseIds(
    @Request() req: IAuthenticatedRequest,
    @Param('releaseId') releaseId: string,
  ) {
    return this.reviewsService.findByUserReleaseIds(req.user.id, releaseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() dto: CreateReviewRequestDto,
  ) {
    return this.reviewsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: IAuthenticatedRequest,
    @Body() dto: UpdateReviewRequestDto,
    @Param('id') id: string,
  ) {
    return this.reviewsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: IAuthenticatedRequest, @Param('id') id: string) {
    return this.reviewsService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get('admin')
  findAll(@Query() query: FindReviewsQuery) {
    return this.reviewsService.findAll(query);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId/:id')
  updateById(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewRequestDto,
  ) {
    return this.reviewsService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':userId/:id')
  adminDelete(@Param('id') id: string, @Param('userId') userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
