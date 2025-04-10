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
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReleaseReviewQueryDto } from './dto/release-review-query.dto';
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
    @Param('id') id: string,
    @Query() query: ReleaseReviewQueryDto,
  ) {
    return this.reviewsService.findByReleaseId(id, query);
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.reviewsService.findByUserId(id);
  }

  @Get('list')
  findReleases() {
    return this.reviewsService.findReviews();
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
