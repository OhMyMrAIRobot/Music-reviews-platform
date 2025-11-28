import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

/**
 * Query parameters for listing nomination winners.
 *
 * Supports filtering by year and month. All fields are optional.
 */
export class NominationWinnersQueryDto {
  /**
   * Optional year filter. When provided the response will be limited to
   * the specified year.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле year должно быть целым числом' })
  year?: number;

  /**
   * Optional month filter (1-12). When provided the response will be
   * limited to the specified month within `year` if `year` is provided.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле month должно быть целым числом' })
  month?: number;
}
