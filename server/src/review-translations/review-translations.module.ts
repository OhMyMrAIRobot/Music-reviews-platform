import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { BluenteTranslateClient } from './bluente-translate.client';
import { ReviewTranslationsController } from './review-translations.controller';
import { ReviewTranslationsService } from './review-translations.service';

@Module({
  imports: [PrismaModule, ReviewsModule],
  controllers: [ReviewTranslationsController],
  providers: [ReviewTranslationsService, BluenteTranslateClient],
  exports: [ReviewTranslationsService],
})
export class ReviewTranslationsModule {}
