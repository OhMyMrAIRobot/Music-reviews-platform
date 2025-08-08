import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class ReleaseMediaRequestQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Лимит должен быть целым числом' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Смещение должно быть целым числом' })
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
