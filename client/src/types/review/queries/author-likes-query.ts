/**
 * AuthorLikeQuery — query parameters for fetching author-like relations.
 *
 */
export type AuthorLikesQuery = {
  /** Maximum number of items to return (pagination limit). */
  limit?: number;

  /** Number of items to skip (pagination offset). */
  offset?: number;
};
