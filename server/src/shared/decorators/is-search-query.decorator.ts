import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

/**
 * Decorator that applies validation to ensure a field is a valid search query.
 *
 * Combines `IsString` and `Matches` validators to enforce that the value
 * is a string containing only allowed characters: alphanumeric, spaces,
 * hyphens, apostrophes, and Cyrillic letters.
 *
 * @returns A decorator function that applies the validation rules.
 */
export function IsSearchQuery() {
  return applyDecorators(
    IsString(),
    Matches(/^[\w\s\-'.а-яА-ЯёЁ]*$/, {
      message: 'Поисковый запрос содержит недопустимые символы',
    }),
  );
}
