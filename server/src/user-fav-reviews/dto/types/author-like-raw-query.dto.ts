import { AuthorLikesResponseDto } from '../response/author-likes.response.dto';

/**
 * AuthorLikeRawQueryDto — wrapper that matches the shape returned by the
 * repository/raw SQL helper when executing the author-like aggregation query.
 *
 * The raw query returns a single `result` object containing `meta` and
 * `items`, so this wrapper mirrors that structure for type-safety.
 */
export type AuthorLikeRawQueryDto = {
  result: AuthorLikesResponseDto;
};

/** Array shape returned by some raw query helpers which produce multiple rows. */
export type AuthorLikeRawQueryArrayDto = Array<AuthorLikeRawQueryDto>;
