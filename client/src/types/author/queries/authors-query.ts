/**
 * Query parameters for listing authors.
 *
 * Supports filtering by author type, free-text search, registration status, and pagination (limit/offset). All fields are optional.
 */
export type AuthorsQuery = {
  /** Filter by author type id. */
  typeId?: string;

  /** Free-text search string applied to author name. */
  search?: string;

  /** If true, return only authors who are registered in the system. */
  onlyRegistered?: boolean;

  /** Include authors linked to the specified user id. */
  userId?: string;

  /** Pagination limit (integer). */
  limit?: number;

  /** Pagination offset (integer). */
  offset?: number;
};
