import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReviewTranslationsQueryDto } from './dto/request/query/review-translations.query.dto';
import { ReviewTranslationsService } from './review-translations.service';
import { LanguagesEnum } from './types/languages.enum';

@Controller('review-translations')
export class ReviewTranslationsController {
  constructor(
    private readonly reviewTranslationsService: ReviewTranslationsService,
  ) {}

  @Get(':reviewId')
  getReviewTranslations(
    @Param('reviewId') reviewId: string,
    @Query() query: ReviewTranslationsQueryDto,
  ) {
    const language = query.language ?? LanguagesEnum.RU;
    const from = query.from ?? LanguagesEnum.RU;
    return this.reviewTranslationsService.findTranslations(
      reviewId,
      language,
      from,
    );
  }
}
