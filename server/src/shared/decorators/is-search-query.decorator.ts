import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsSearchQuery() {
  return applyDecorators(
    IsString(),
    Matches(/^[\w\s\-'.а-яА-ЯёЁ]*$/, {
      message: 'Поисковый запрос содержит недопустимые символы',
    }),
  );
}
