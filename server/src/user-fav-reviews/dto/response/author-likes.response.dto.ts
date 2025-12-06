import { AuthorLikeDto } from './author-like.dto';

/**
 * AuthorLikesResponseDto — standard paginated response shape used by the
 * author-likes endpoint. Contains an array of `AuthorLikeDto` items and
 * metadata about the overall result set.
 */
export type AuthorLikesResponseDto = {
  meta: MetaInfo;
  items: AuthorLikeDto[];
};

/**
 * MetaInfo — pagination / metadata for lists of author-likes.
 */
type MetaInfo = {
  /** Total number of matching items */
  count: number;
};
