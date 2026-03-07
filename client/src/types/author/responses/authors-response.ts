import { Author } from "..";

/**
 * Standard paginated response for authors list endpoints.
 *
 * - `meta` contains pagination metadata
 * - `items` is the array of serialized authors
 */
export type AuthorsResponse = {
  meta: MetaInfo;
  items: Author[];
};

/** Basic meta information returned with lists. */
type MetaInfo = {
  /** Total number of items in the current result set */
  count: number;
};
