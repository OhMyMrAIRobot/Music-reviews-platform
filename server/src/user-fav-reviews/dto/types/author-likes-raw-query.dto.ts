import { AuthorLikesResponseDto } from '../response/author-likes.response.dto';

/**
 * AuthorLikeRawQueryDto — wrapper that matches the shape returned by the
 * repository/raw SQL helper when executing the author-like aggregation query.
 *
 * The raw query returns a single `result` object containing `meta` and
 * `items`, so this wrapper mirrors that structure for type-safety.
 */
export type AuthorLikesRawQueryDto = {
  result: AuthorLikesResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type AuthorLikesRawQueryArrayDto = Array<AuthorLikesRawQueryDto>;
