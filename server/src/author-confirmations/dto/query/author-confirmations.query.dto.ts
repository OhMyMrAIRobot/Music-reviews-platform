import { Type } from 'class-transformer';
import { IsInt, IsOptional, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * Query DTO for listing author confirmations.
 *
 * All fields are optional and control filtering, searching, sorting and
 * pagination of confirmations returned by the API.
 */
export class AuthorConfirmationsQueryDto {
  /** Optional user id to filter confirmations submitted by a specific user. */
  @IsOptional()
  @IsEntityId()
  userId?: string;

  /** Optional status id to filter confirmations by their current status. */
  @IsOptional()
  @IsEntityId()
  statusId?: string;

  /**
   * Optional search string. Limits to 1-50 characters; used to search by
   * author name or user nickname (case-insensitive).
   */
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  search?: string;

  /** Optional sort order for the results. */
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
