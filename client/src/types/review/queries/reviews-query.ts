import { SortOrder } from '../../common/types/sort-order';
import { ReviewsSortFieldsEnum } from '../enums';

/**
 * ReviewsQuery
 *
 * Query parameters accepted by the reviews listing endpoint. These
 * allow filtering by user/author, searching by text, toggling
 * author-only likes and controlling sort/pagination.
 */
export type ReviewsQuery = {
  /** Filter reviews by the author's user id (review author). */
  userId?: string;

  /** Filter reviews by a release author id (artist/producer/designer). */
  authorId?: string;

  /** Filter reviews by a release id. */
  releaseId?: string;

  /** Filter reviews favourited by the provided user id. */
  favUserId?: string;

  /** Free-text search applied to review title and text. */
  search?: string;

  /** When true, only include reviews that have likes from authors. */
  hasAuthorLikes?: boolean;

  /** Field to sort by. Allowed values: defined in `ReviewsSortFieldsEnum`. */
  sortField?: ReviewsSortFieldsEnum;

  /** Sort order: 'asc' or 'desc'. */
  sortOrder?: SortOrder;

  /** When true, only include reviews that have text (non-empty title or text). */
  withTextOnly?: boolean;

  /** Pagination limit (integer). */
  limit?: number;

  /** Pagination offset (integer). */
  offset?: number;
};
