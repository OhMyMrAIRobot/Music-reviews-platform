import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Length } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { ReleaseSortFieldsEnum } from 'src/releases/types/release-sort-fields.enum';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class FindReleasesQueryDto {
  @IsOptional()
  @IsEntityId()
  typeId?: string;

  @IsOptional()
  @IsIn(Object.values(ReleaseSortFieldsEnum))
  field?: string;

  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  query?: string;

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
}
