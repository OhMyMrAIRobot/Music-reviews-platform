import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Length } from 'class-validator';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * Query DTO for listing users.
 *
 * Supports search, pagination and simple role filtering. Validation
 * decorators provide clear error messages when query parameters are
 * malformed.
 */
export class UsersQueryDto {
  /**
   * Optional search string used to match against user fields.
   */
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  search?: string;

  /**
   * Optional limit for pagination (converted to number by transformer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /**
   * Optional offset for pagination (converted to number by transformer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;

  /**
   * Optional role filter (one of UserRoleEnum values).
   */
  @IsOptional()
  @IsEnum(UserRoleEnum, {
    message: 'Поле role должно быть одним из допустимых значений',
  })
  role?: UserRoleEnum;

  /**
   * Optional sort order, validated by `IsSortOrder` decorator.
   */
  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;
}
