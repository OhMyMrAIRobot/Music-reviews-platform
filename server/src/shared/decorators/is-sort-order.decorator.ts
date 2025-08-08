import { applyDecorators } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';

export function IsSortOrder() {
  return applyDecorators(
    IsString(),
    IsIn(['asc', 'desc'], {
      message: 'Порядок сортировки должен быть "asc" или "desc"',
    }),
  );
}
