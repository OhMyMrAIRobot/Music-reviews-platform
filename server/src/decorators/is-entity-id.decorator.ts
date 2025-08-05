import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsEntityId() {
  return applyDecorators(
    IsString({ message: 'Идентификатор должен быть строкой!' }),
    Matches(/^[a-zA-Z0-9]+$/, {
      message: 'Идентификатор может содержать только цифры и буквы!',
    }),
  );
}
