import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { AdminReviewsController } from './admin-reviews.controller';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [UsersModule, ReleasesModule, PrismaModule, AuthorsModule],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
