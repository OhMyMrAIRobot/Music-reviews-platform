import { AuthorDto } from './author.dto';

/**
 * Standard paginated response for authors list endpoints.
 *
 * - `meta` contains pagination metadata
 * - `items` is the array of serialized authors
 */
export type AuthorsResponseDto = {
  meta: MetaInfo;
  items: AuthorDto[];
};

/** Basic pagination/meta information returned with lists. */
type MetaInfo = {
  /** Total number of items in the current result set */
  count: number;
};
