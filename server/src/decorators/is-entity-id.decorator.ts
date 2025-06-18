import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsEntityId() {
  return applyDecorators(
    IsString(),
    Matches(/^[a-zA-Z0-9]+$/, {
      message: 'Id может содержать только цифры и буквы',
    }),
  );
}
