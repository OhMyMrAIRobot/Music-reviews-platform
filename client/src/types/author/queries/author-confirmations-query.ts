import { SortOrder } from '../../common/types/sort-order';

/**
 * Query for listing author confirmations.
 *
 * All fields are optional and control filtering, searching, sorting and
 * pagination of confirmations returned by the API.
 */
export type AuthorConfirmationsQuery = {
  /** Optional user id to filter confirmations submitted by a specific user. */
  userId?: string;

  /** Optional status id to filter confirmations by their current status. */
  statusId?: string;

  /**
   * Optional search string. Limits to 1-50 characters; used to search by
   * author name or user nickname (case-insensitive).
   */
  search?: string;

  /** Optional sort order for the results. */
  order?: SortOrder;

  /** Pagination limit (integer). */
  limit?: number;

  /** Pagination offset (integer). */
  offset?: number;
};
