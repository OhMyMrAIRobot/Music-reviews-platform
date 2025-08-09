import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { RegisteredAuthorsModule } from 'src/registered-authors/registered-authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { AuthorCommentsController } from './author-comments.controller';
import { AuthorCommentsService } from './author-comments.service';

@Module({
  imports: [
    PrismaModule,
    ReleasesModule,
    ReviewsModule,
    RegisteredAuthorsModule,
  ],
  controllers: [AuthorCommentsController],
  providers: [AuthorCommentsService],
  exports: [AuthorCommentsService],
})
export class AuthorCommentsModule {}
