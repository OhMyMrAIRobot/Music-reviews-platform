import { SortOrder } from "../../common/types/sort-order";
import { ReleasesSortFieldsEnum } from "../enums/releases-sort-fields-enum";

/**
 * ReleasesQuery
 *
 * Query parameters for listing releases. Supports filtering by author,
 * release type, search text and publication date. Also provides sorting
 * and pagination controls.
 */
export type ReleasesQuery = {
  /**
   * Filter results by author id (optional).
   */
  authorId?: string;

  /**
   * Filter results by release type id (optional).
   */
  typeId?: string;

  /**
   * Free-text search query for release title (optional).
   */
  search?: string;

  /**
   * Field to sort by. Allowed values are defined in
   * `ReleasesSortFieldsEnum` (optional).
   */
  sortField?: ReleasesSortFieldsEnum;

  /**
   * Sort order: 'asc' or 'desc' (optional).
   */
  sortOrder?: SortOrder;

  /**
   * When true return most reviewed releases in the last 24h (optional).
   */
  last24h?: boolean;

  /**
   * Filter by publication year (integer). Range: 1600 .. current year (optional).
   */
  year?: number;

  /**
   * Filter by publication month (1..12).
   */
  month?: number;

  /**
   * Pagination limit (optional).
   */
  limit?: number;

  /**
   * Pagination offset (optional).
   */
  offset?: number;
};
