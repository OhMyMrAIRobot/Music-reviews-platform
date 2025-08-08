// review-query.dto.ts
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { IsSortOrder } from 'src/decorators/is-sort-order.decorator';
import { ReviewSortFieldsEnum } from 'src/reviews/types/review-sort-fields.enum';
import { SortOrder } from 'src/shared/types/sort-order.type';

export class FindReviewsByReleaseIdQuery {
  @IsOptional()
  @IsIn(Object.values(ReviewSortFieldsEnum))
  field?: string;

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
