import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindLeaderboardQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;
}
