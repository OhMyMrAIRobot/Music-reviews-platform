import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class TopRatingReleasesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1400)
  @Max(
    new Date(
      new Date().setFullYear(new Date().getFullYear() + 3),
    ).getFullYear(),
  )
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
