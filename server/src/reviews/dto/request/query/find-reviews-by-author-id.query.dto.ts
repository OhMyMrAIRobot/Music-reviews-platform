// review-query.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindReviewsByAuthorIdQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;
}
