import { AuthorCommentDto } from './author-comment.dto';

/**
 * AuthorCommentsResponseDto — standard paginated response shape returned by
 * the author-comments list endpoint. Contains `items` (array of
 * `AuthorCommentDto`) and `meta` information.
 */
export type AuthorCommentsResponseDto = {
  meta: MetaInfo;
  items: AuthorCommentDto[];
};

/**
 * MetaInfo — pagination and metadata for author-comments list responses.
 */
type MetaInfo = {
  /** Total number of matching comments */
  count: number;
};
