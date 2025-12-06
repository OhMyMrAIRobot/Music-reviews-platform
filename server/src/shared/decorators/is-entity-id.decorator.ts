import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

/**
 * Decorator that applies validation to ensure a field is a valid entity ID.
 *
 * Combines `IsString` and `Matches` validators to enforce that the value
 * is a string consisting only of letters and numbers (alphanumeric).
 *
 * @returns A decorator function that applies the validation rules.
 */
export function IsEntityId() {
  return applyDecorators(
    IsString({ message: 'Идентификатор должен быть строкой!' }),
    Matches(/^[a-zA-Z0-9]+$/, {
      message: 'Идентификатор может содержать только цифры и буквы!',
    }),
  );
}
