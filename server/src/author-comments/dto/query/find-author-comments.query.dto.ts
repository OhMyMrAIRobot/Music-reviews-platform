import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class FindAuthorCommentsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;

  @IsOptional()
  @IsSearchQuery()
  query?: string;
}
