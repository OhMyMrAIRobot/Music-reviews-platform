import { LanguagesEnum } from '../../types/languages.enum';

export type ReviewTranslationResponseDto = {
  reviewId: string;
  language: LanguagesEnum;
  title: string;
  text: string;
};
