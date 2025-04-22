import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavReviewsController } from './user-fav-reviews.controller';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Module({
  imports: [UsersModule, ReviewsModule],
  controllers: [UserFavReviewsController],
  providers: [UserFavReviewsService, PrismaService],
  exports: [UserFavReviewsService],
})
export class UserFavReviewsModule {}
