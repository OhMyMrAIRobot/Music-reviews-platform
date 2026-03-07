import { AuthorConfirmation } from "../entities";

/**
 * Paginated response envelope for author confirmations listing endpoints.
 *
 * `items` contains the current page of `AuthorConfirmation` entries while
 * `meta` provides collection-level metadata such as the total count.
 */
export type AuthorConfirmationsResponse = {
  meta: MetaInfo;
  items: AuthorConfirmation[];
};

/** Basic pagination metadata shape. */
type MetaInfo = {
  /** Total number of confirmations matching the query. */
  count: number;
};
