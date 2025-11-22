import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ReleaseSortFieldsEnum } from 'src/releases/types/release-sort-fields.enum';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * ReleasesQueryDto
 *
 * Query parameters for listing releases. Supports filtering by author,
 * release type, search text and publication date. Also provides sorting
 * and pagination controls. Validation errors/messages are provided in
 * Russian (see individual validators).
 */
export class ReleasesQueryDto {
  /**
   * Filter results by author id (optional).
   * Validated by `IsEntityId` (alphanumeric string).
   */
  @IsOptional()
  @IsEntityId()
  authorId?: string;

  /**
   * Filter results by release type id (optional).
   * Validated by `IsEntityId`.
   */
  @IsOptional()
  @IsEntityId()
  typeId?: string;

  /**
   * Free-text search query for release title (optional).
   * Only allowed characters are validated by `IsSearchQuery` decorator.
   */
  @IsOptional()
  @IsSearchQuery()
  search?: string;

  /**
   * Field to sort by. Allowed values are defined in
   * `ReleaseSortFieldsEnum`.
   */
  @IsOptional()
  @IsIn(Object.values(ReleaseSortFieldsEnum), {
    message: 'Поле sortField имеет неверное значение',
  })
  sortField?: ReleaseSortFieldsEnum;

  /**
   * Sort order: 'asc' or 'desc'. Validated by `IsSortOrder` decorator.
   */
  @IsOptional()
  @IsSortOrder()
  sortOrder?: SortOrder;

  /**
   * When true, limit results to releases created in the last 24 hours.
   */
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Поле last24h должно быть булевым значением' })
  last24h?: boolean;

  /**
   * Filter by publication year (integer). Range: 1600 .. current year.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле year должно быть целым числом' })
  @Min(1600, { message: 'Год не может быть раньше 1600' })
  @Max(new Date().getFullYear(), {
    message: `Год не может быть больше ${new Date().getFullYear()}`,
  })
  year?: number;

  /**
   * Filter by publication month (1..12).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле month должно быть целым числом' })
  @Min(1, { message: 'Месяц не может быть меньше 1' })
  @Max(12, { message: 'Месяц не может быть больше 12' })
  month?: number;

  /**
   * Pagination limit (integer). Use server defaults when omitted.
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
