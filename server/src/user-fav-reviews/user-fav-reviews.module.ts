import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavReviewsController } from './user-fav-reviews.controller';
import { UserFavReviewsService } from './user-fav-reviews.service';

@Module({
  imports: [UsersModule, ReviewsModule, PrismaModule],
  controllers: [UserFavReviewsController],
  providers: [UserFavReviewsService],
  exports: [UserFavReviewsService],
})
export class UserFavReviewsModule {}
