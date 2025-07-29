import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/types/sort-order.type';

export class ReleaseMediaRequestQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Лимит должен быть целым числом' })
  @Min(1, { message: 'Лимит должен быть больше 1' })
  @Max(100, { message: 'Лимит должен быть не больше 100' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Смещение должно быть целым числом' })
  @Min(1, { message: 'Смещение должно быть больше 0' })
  @Max(100, { message: 'Смещение должно быть не больше 100' })
  offset?: number;

  @IsOptional()
  @IsEntityId()
  statusId?: string;

  @IsOptional()
  @IsEntityId()
  typeId?: string;

  @IsOptional()
  @IsEntityId()
  releaseId?: string;

  @IsOptional()
  @IsEntityId()
  userId?: string;

  @IsOptional()
  @IsSearchQuery()
  query?: string;

  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;
}
