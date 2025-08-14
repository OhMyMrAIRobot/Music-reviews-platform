import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavReview } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { FindUserFavByReviewIdResponseDto } from './dto/response/find-user-fav-by-review-id.response.dto';

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

  async findByReviewId(
    reviewId: string,
  ): Promise<FindUserFavByReviewIdResponseDto> {
    const reviewWithRelease = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        release: {
          select: {
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
      },
    });

    if (!reviewWithRelease) {
      throw new EntityNotFoundException('Рецензия', 'id', reviewId);
    }

    const favs = await this.prisma.userFavReview.findMany({
      where: { reviewId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true } },
            registeredAuthor: { select: { authorId: true } },
          },
        },
      },
    });

    return plainToInstance(
      FindUserFavByReviewIdResponseDto,
      {
        userFavReview: favs,
        review: { release: reviewWithRelease.release },
      },
      { excludeExtraneousValues: true },
    );
  }

  async remove(reviewId: string, userId: string) {
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
