import { ReleaseMediaResponseDto } from '../dto/response/release-media.response.dto';

/**
 * Wrapper type that matches the structure returned by raw SQL queries.
 *
 * The raw query returns an object with a single `result` column that
 * contains the structured response payload.
 */
export type ReleaseMediaRawQueryDto = {
  result: ReleaseMediaResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type ReleaseMediaRawQueryArrayDto = Array<ReleaseMediaRawQueryDto>;
