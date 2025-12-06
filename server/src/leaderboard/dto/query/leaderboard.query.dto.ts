import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

/**
 * Query parameters for listing leaderboard.
 *
 * Supports pagination (limit/offset). All fields are optional.
 */
export class LeaderboardQueryDto {
  /**
   * Pagination limit (integer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /**
   * Pagination offset (integer).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;
}
