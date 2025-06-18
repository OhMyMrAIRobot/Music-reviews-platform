import {
  Body,
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
import { CreateUserFavReviewDto } from './dto/create-user-fav-review.dto';
import { DeleteUserFavReviewDto } from './dto/delete-user-fav-review.dto';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Controller('user-fav-reviews')
export class UserFavReviewsController {
  constructor(private readonly userFavReviewsService: UserFavReviewsService) {}

  @Get()
  findAll() {
    return this.userFavReviewsService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavReviewsService.findByUserId(id);
  }

  @Get('review/:id')
  findByReviewId(@Param('id') id: string) {
    return this.userFavReviewsService.findByReviewId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createUserFavReviewDto: CreateUserFavReviewDto,
  ) {
    return this.userFavReviewsService.create(
      createUserFavReviewDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Request() req: IAuthenticatedRequest,
    @Body() deleteUserFavReviewDto: DeleteUserFavReviewDto,
  ) {
    return this.userFavReviewsService.remove(
      deleteUserFavReviewDto,
      req.user.id,
    );
  }
}
