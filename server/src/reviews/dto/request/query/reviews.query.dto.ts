import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional } from 'class-validator';
import { ReviewSortFieldsEnum } from 'src/reviews/types/review-sort-fields.enum';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';
import { IsSearchQuery } from 'src/shared/decorators/is-search-query.decorator';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

/**
 * ReviewsQueryDto
 *
 * Query parameters accepted by the reviews listing endpoint. These
 * allow filtering by user/author, searching by text, toggling
 * author-only likes and controlling sort/pagination. Validation
 * decorators enforce basic value shapes.
 */
export class ReviewsQueryDto {
  /** Filter reviews by the author's user id (review author). */
  @IsOptional()
  @IsEntityId()
  userId?: string;

  /** Filter reviews by a release author id (artist/producer/designer). */
  @IsOptional()
  @IsEntityId()
  authorId?: string;

  /** Filter reviews by a release id. */
  @IsOptional()
  @IsEntityId()
  releaseId?: string;

  /** Filter reviews favourited by the provided user id. */
  @IsOptional()
  @IsEntityId()
  favUserId?: string;

  /** Free-text search applied to review title and text. */
  @IsOptional()
  @IsSearchQuery()
  search?: string;

  /** When true, only include reviews that have likes from authors. */
  @IsOptional()
  @Type(() => Boolean)
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Поле hasAuthorLikes должно быть булевым значением' })
  hasAuthorLikes?: boolean;

  /** Field to sort by. Allowed values: defined in `ReviewSortFieldsEnum`. */
  @IsOptional()
  @IsIn(Object.values(ReviewSortFieldsEnum), {
    message: 'Поле sortField имеет неверное значение',
  })
  sortField?: ReviewSortFieldsEnum;

  /** Sort order: 'asc' or 'desc'. Validated by `IsSortOrder`. */
  @IsOptional()
  @IsSortOrder()
  sortOrder?: SortOrder;

  /** Pagination limit (integer). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  limit?: number;

  /** Pagination offset (integer). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле offset должно быть целым числом' })
  offset?: number;
}
