import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [UsersModule, ReleasesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
