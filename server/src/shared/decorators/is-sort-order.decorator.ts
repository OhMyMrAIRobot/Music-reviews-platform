import { applyDecorators } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';

/**
 * Decorator that applies validation to ensure a field is a valid sort order.
 *
 * Combines `IsString` and `IsIn` validators to enforce that the value
 * is a string equal to either 'asc' or 'desc'.
 *
 * @returns A decorator function that applies the validation rules.
 */
export function IsSortOrder() {
  return applyDecorators(
    IsString(),
    IsIn(['asc', 'desc'], {
      message: 'Порядок сортировки должен быть "asc" или "desc"',
    }),
  );
}
