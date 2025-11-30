import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * ReleaseMediaQueryDto
 *
 * Query parameters for listing release media. Supports filtering by author,
 * release, status, type, search text. Also provides sorting
 * and pagination controls.
 */
export class ReleaseMediaQueryDto {
  /** Optional filter by release media status id. */
  @IsOptional()
  @IsEntityId()
  statusId?: string;

  /** Optional filter by release media type id. */
  @IsOptional()
  @IsEntityId()
  typeId?: string;

  /** Optional filter by related release id. */
  @IsOptional()
  @IsEntityId()
  releaseId?: string;

  /** Optional filter by submitting user id. */
  @IsOptional()
  @IsEntityId()
  userId?: string;

  /** Optional text search applied to title/url fields. */
  @IsOptional()
  @IsSearchQuery()
  search?: string;

  /** Optional sort order for returned items (`asc` or `desc`). */
  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;

  /** Maximum number of items to return (pagination limit). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Лимит должен быть целым числом' })
  limit?: number;

  /** Pagination offset (number of items to skip). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Смещение должно быть целым числом' })
  offset?: number;
}
