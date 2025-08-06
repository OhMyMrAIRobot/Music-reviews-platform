import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class ReviewsQueryDto {
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

  @IsOptional()
  @IsEntityId()
  userId?: string;

  @IsOptional()
  @IsEntityId()
  favUserId?: string;

  @IsOptional()
  @IsSearchQuery()
  query?: string;
}
