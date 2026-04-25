import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import { ReviewsService } from './reviews.service';

@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * PATCH /admin/reviews/:id
   *
   * Admin-only endpoint to update any review.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateReviewRequestDto,
  ) {
    return this.reviewsService.update(id, dto);
  }

  /**
   * DELETE /admin/reviews/:id
   *
   * Admin-only endpoint to delete any review.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async adminDelete(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
