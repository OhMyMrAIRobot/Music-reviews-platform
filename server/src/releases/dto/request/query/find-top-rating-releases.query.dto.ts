import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindTopRatingReleasesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1600)
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
