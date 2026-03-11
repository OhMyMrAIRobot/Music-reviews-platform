import { AuthorLike } from '../entities';

/**
 * AuthorLikesResponse — standard paginated response shape used by the
 * author-likes endpoint. Contains an array of `AuthorLike` items and
 * metadata about the overall result set.
 */
export type AuthorLikesResponse = {
  meta: MetaInfo;
  items: AuthorLike[];
};

/**
 * MetaInfo — pagination / metadata for lists of author-likes.
 */
type MetaInfo = {
  /** Total number of matching items */
  count: number;
};
