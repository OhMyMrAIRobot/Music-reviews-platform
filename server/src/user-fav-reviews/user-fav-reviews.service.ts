import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavReview } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(reviewId: string, userId: string): Promise<UserFavReview> {
    await this.usersService.findOne(userId);
    const review = await this.reviewsService.findOne(reviewId);

    if (userId === review.userId) {
      throw new ConflictException(
        'Вы не можете отметить свою рецензию как понравившеюся!',
      );
    }

    const existing = await this.findOne(userId, reviewId);
    if (existing) {
      throw new ConflictException(
        'Вы уже отметили данную рецензию как понравившеюся!',
      );
    }

    return this.prisma.userFavReview.create({
      data: { reviewId, userId },
    });
  }

  async findByUserId(userId: string): Promise<UserFavReview[]> {
    await this.usersService.findOne(userId);

    return this.prisma.userFavReview.findMany({
      where: { userId },
    });
  }

  async findByReviewId(reviewId: string): Promise<UserFavReview[]> {
    await this.reviewsService.findOne(reviewId);

    return this.prisma.userFavReview.findMany({
      where: { reviewId },
    });
  }

  async remove(reviewId: string, userId: string): Promise<UserFavReview> {
    await this.reviewsService.findOne(reviewId);
    await this.usersService.findOne(userId);

    const existing = await this.findOne(userId, reviewId);
    if (!existing) {
      throw new ConflictException(
        'Вы не отмечали данную рецензию как понравившеюся!',
      );
    }

    return this.prisma.userFavReview.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }

  async findOne(
    userId: string,
    reviewId: string,
  ): Promise<UserFavReview | null> {
    return this.prisma.userFavReview.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }
}
