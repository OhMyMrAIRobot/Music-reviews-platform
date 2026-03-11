import { SortOrder } from '../../common/types/sort-order';

/**
 * ReleaseMediaQuery
 *
 * Query parameters for listing release media. Supports filtering by author,
 * release, status, type, search text. Also provides sorting
 * and pagination controls.
 */
export type ReleaseMediaQuery = {
  /** Optional filter by release media status id. */
  statusId?: string;

  /** Optional filter by release media type id. */
  typeId?: string;

  /** Optional filter by related release id. */
  releaseId?: string;

  /** Optional filter by submitting user id. */
  userId?: string;

  /** Optional text search applied to title/url fields. */
  search?: string;

  /** Optional sort order for returned items (`asc` or `desc`). */
  order?: SortOrder;

  /** Maximum number of items to return (pagination limit). */
  limit?: number;

  /** Pagination offset (number of items to skip). */
  offset?: number;
};
