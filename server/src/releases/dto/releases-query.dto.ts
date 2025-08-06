import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Length } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class ReleasesQueryDto {
  @IsOptional()
  @IsEntityId()
  typeId?: string;

  @IsOptional()
  @IsIn([
    'published',
    'noTextCount',
    'textCount',
    'superUserRating',
    'noTextRating',
    'withTextRating',
  ])
  field?: string;

  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  query?: string;

  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;
}
