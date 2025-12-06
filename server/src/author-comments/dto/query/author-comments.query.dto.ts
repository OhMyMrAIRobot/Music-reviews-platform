import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * AuthorCommentsQueryDto — query parameters for listing author comments.
 *
 * Supports filtering by release, full-text search, sorting and pagination.
 */
export class AuthorCommentsQueryDto {
  /** Filter author comments by release id. */
  @IsOptional()
  @IsEntityId()
  releaseId?: string;

  /** Free-text search applied to title, text, author name and release title. */
  @IsOptional()
  @IsSearchQuery()
  search?: string;

  /** Sort order: 'asc' or 'desc'. */
  @IsOptional()
  @IsSortOrder()
  sortOrder?: SortOrder;

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
