import { AuthorCommentsResponseDto } from '../dto/response/author-comments.response.dto';

/**
 * AuthorCommentsRawQueryDto — wrapper that mirrors the JSON payload returned
 * by the centralized raw SQL query used for author-comments listing.
 *
 * The raw SQL query returns a single column named `result` containing the
 * paginated response object with `items` and `meta` keys, so this type
 * describes that wrapper for type-safe `$queryRaw` calls.
 */
export type AuthorCommentsRawQueryDto = {
  result: AuthorCommentsResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type AuthorCommentsRawQueryArrayDto = Array<AuthorCommentsRawQueryDto>;
