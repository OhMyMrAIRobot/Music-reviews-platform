import { AuthorComment } from "../entities";

/**
 * AuthorCommentsResponse — standard paginated response shape returned by
 * the author-comments list endpoint. Contains `items` (array of
 * `AuthorComment`) and `meta` information.
 */
export type AuthorCommentsResponse = {
  meta: MetaInfo;
  items: AuthorComment[];
};

/**
 * MetaInfo — pagination and metadata for author-comments list responses.
 */
type MetaInfo = {
  /** Total number of matching comments */
  count: number;
};
