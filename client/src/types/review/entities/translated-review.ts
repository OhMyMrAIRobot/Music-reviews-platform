import { ReviewLanguagesEnum } from '../enums/review-languages-enum';

/**
 * TranslatedReview
 *
 * Represents a translated review.
 */
export type TranslatedReview = {
  reviewId: string;
  language: ReviewLanguagesEnum;
  title: string;
  text: string;
};
