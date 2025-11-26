import { ReleasesResponseDto } from '../dto/response/releases.response.dto';

/**
 * ReleaseRawQueryResponseDto — wrapper for the raw SQL query result.
 * The `result` field contains the assembled JSON with `items` and `meta`.
 */
export type ReleasesRawQueryDto = {
  result: ReleasesResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type ReleasesRawQueryArrayDto = Array<ReleasesRawQueryDto>;
