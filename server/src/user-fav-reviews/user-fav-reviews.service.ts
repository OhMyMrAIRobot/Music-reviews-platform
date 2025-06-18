import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavReview } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserFavReviewDto } from './dto/create-user-fav-review.dto';
import { DeleteUserFavReviewDto } from './dto/delete-user-fav-review.dto';

@Injectable()
export class UserFavReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(
    createUserFavReviewDto: CreateUserFavReviewDto,
    userId: string,
  ): Promise<UserFavReview> {
    const { reviewId } = createUserFavReviewDto;
    await this.usersService.findOne(userId);
    const review = await this.reviewsService.findOne(reviewId);

    if (userId === review.userId) {
      throw new ConflictException(
        'Вы не можете отметить свою рецензию как понравившеюся!',
      );
    }

    const existing = await this.findOne(userId, reviewId);
    if (existing) {
      throw new DuplicateFieldException(
        `Пользователь с id '${userId}' и`,
        'id рецезии',
        `${reviewId}`,
      );
    }

    return this.prisma.userFavReview.create({
      data: { ...createUserFavReviewDto, userId },
    });
  }

  async findAll(): Promise<UserFavReview[]> {
    return this.prisma.userFavReview.findMany();
  }

  async findByUserId(userId: string): Promise<UserFavReview[]> {
    const result = await this.prisma.userFavReview.findMany({
      where: { userId },
    });

    // if (result.length === 0) {
    //   throw new EntityNotFoundException(
    //     'Понравившиеся рецензии',
    //     'id пользователя',
    //     `${userId}`,
    //   );
    // }
    return result;
  }

  async findByReviewId(reviewId: string): Promise<UserFavReview[]> {
    const result = await this.prisma.userFavReview.findMany({
      where: { reviewId },
    });

    // if (result.length === 0) {
    //   throw new EntityNotFoundException(
    //     'Пользователи, которорым понравилась рецензия',
    //     'id',
    //     `${reviewId}`,
    //   );
    // }
    return result;
  }

  async remove(
    deleteUserFavReviewDto: DeleteUserFavReviewDto,
    userId: string,
  ): Promise<UserFavReview> {
    const { reviewId } = deleteUserFavReviewDto;

    const existing = await this.findOne(userId, reviewId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Пользователь с id '${userId}' и`,
        'id рецензии',
        `${reviewId}`,
      );
    }

    return this.prisma.userFavReview.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }

  private async findOne(
    userId: string,
    reviewId: string,
  ): Promise<UserFavReview | null> {
    return this.prisma.userFavReview.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });
  }
}
