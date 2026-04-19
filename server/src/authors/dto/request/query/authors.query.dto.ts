import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { TransformQueryBoolean } from 'src/shared/decorators/transform-query-boolean.decorator';

/**
 * Query parameters for listing authors.
 *
 * Supports filtering by author type, free-text search, registration status, and pagination (limit/offset). All fields are optional.
 */
export class AuthorsQueryDto {
  /**
   * Filter by author type id.
   */
  @IsOptional()
  @IsEntityId()
  typeId?: string;

  /**
   * Free-text search string applied to author name.
   * - Length: 1..50 characters when provided
   */
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  search?: string;

  /**
   * If true, return only authors who are registered in the system.
   */
  @IsOptional()
  @TransformQueryBoolean()
  @IsBoolean()
  onlyRegistered?: boolean;

  /**
   * Include authors linked to the specified user id.
   */
  @IsOptional()
  @IsEntityId()
  userId?: string;

  /**
   * Pagination limit (integer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /**
   * Pagination offset (integer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;
}
