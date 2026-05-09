import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { BluenteTranslateClient } from './bluente-translate.client';
import { ReviewTranslationResponseDto } from './dto/response/review-translation.response.dto';
import {
  buildTranslationPayload,
  parseTranslatedPayload,
  sanitizeTranslatedPayload,
} from './review-translation-payload';
import { LanguagesEnum } from './types/languages.enum';

@Injectable()
export class ReviewTranslationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewsService: ReviewsService,
    private readonly bluenteTranslateClient: BluenteTranslateClient,
  ) {}

  async findTranslations(
    reviewId: string,
    language: LanguagesEnum,
    from: LanguagesEnum,
  ): Promise<ReviewTranslationResponseDto> {
    const review = await this.reviewsService.findOne(reviewId);

    if (!review.title || !review.text) {
      throw new BadRequestException('Review title or text is missing');
    }

    const cached = await this.prisma.reviewTranslation.findUnique({
      where: {
        reviewId_language: { reviewId, language },
      },
    });
    if (cached) {
      return this.toResponse(reviewId, language, cached.title, cached.text);
    }

    if (from === language) {
      return this.toResponse(reviewId, language, review.title, review.text);
    }

    const payload = buildTranslationPayload({
      title: review.title,
      text: review.text,
    });
    const rawTranslated = await this.bluenteTranslateClient.translateText({
      from,
      to: language,
      text: payload,
    });
    const sanitized = sanitizeTranslatedPayload(rawTranslated);

    let title: string;
    let text: string;
    try {
      const parsed = parseTranslatedPayload(sanitized);
      title = parsed.title;
      text = parsed.text;
    } catch {
      throw new BadGatewayException('Invalid translation response');
    }

    try {
      await this.prisma.reviewTranslation.create({
        data: {
          reviewId,
          language,
          title,
          text,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const raced = await this.prisma.reviewTranslation.findUnique({
          where: {
            reviewId_language: { reviewId, language },
          },
        });
        if (raced) {
          return this.toResponse(reviewId, language, raced.title, raced.text);
        }
      }
      throw err;
    }

    return this.toResponse(reviewId, language, title, text);
  }

  private toResponse(
    reviewId: string,
    language: LanguagesEnum,
    title: string,
    text: string,
  ): ReviewTranslationResponseDto {
    return { reviewId, language, title, text };
  }
}
