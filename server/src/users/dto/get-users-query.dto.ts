import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Length } from 'class-validator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { SortOrder } from 'src/types/sort-order.type';

export class GetUsersQueryDto {
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  query?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;
}
