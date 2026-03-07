import { Review } from "../entities";

/**
 * ReviewsResponse
 *
 * Standardized response for listing reviews. Contains an `items`
 * array and a `meta` object with pagination/statistics fields.
 */
export type ReviewsResponse = {
  /** Array of review items matching the query */
  items: Review[];

  /** Additional metadata about the result set */
  meta: MetaInfo;
};

/** Metadata returned with review lists */
type MetaInfo = {
  /** Total number of reviews matching the filters */
  count: number;
};
