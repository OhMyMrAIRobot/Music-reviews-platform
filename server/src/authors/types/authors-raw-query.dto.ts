import { AuthorsResponseDto } from '../dto/response/authors.response.dto';

/**
 * Wrapper type used by raw SQL queries that return a JSON `result` object.
 *
 * Many modules build a JSON payload in SQL (jsonb_build_object) and return
 * rows shaped as `{ result: { meta, items } }`. This type models that shape
 * for authors-specific queries.
 */
export type AuthorsRawQueryDto = {
  result: AuthorsResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type AuthorsRawQueryArrayDto = Array<AuthorsRawQueryDto>;
