import { Type } from 'class-transformer';
import { IsInt, IsOptional, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * Query parameters for listing feedback items.
 *
 * Supports filtering by `statusId`, free-text `search`, sorting order
 * and pagination via `limit` and `offset`.
 */
export class FeedbackQueryDto {
  /** Filter by feedback status id (entity identifier). */
  @IsOptional()
  @IsEntityId()
  statusId?: string;

  /** Free-text search applied to feedback content or title (1..50 chars). */
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  search?: string;

  /** Sort order (`asc` or `desc`). */
  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;

  /** Pagination limit (integer). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /** Pagination offset (integer). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;
}
