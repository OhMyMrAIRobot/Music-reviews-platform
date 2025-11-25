import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

/**
 * AuthorLikeQueryDto — query parameters for fetching author-like relations.
 *
 * These fields are accepted as HTTP query parameters and control pagination
 * for lists of "author likes" returned by the API.
 */
export class AuthorLikeQueryDto {
  /** Maximum number of items to return (pagination limit). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /** Number of items to skip (pagination offset). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;
}
