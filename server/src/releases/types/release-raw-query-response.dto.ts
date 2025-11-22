import { ReleasesResponseDto } from '../dto/response/releases.response.dto';

/**
 * ReleaseRawQueryResponseDto — wrapper for the raw SQL query result.
 * The `result` field contains the assembled JSON with `items` and `meta`.
 */
export type ReleaseRawQueryResponseDto = {
  result: ReleasesResponseDto;
};

/** Array of such responses (Prisma returns an array of rows) */
export type ReleaseRawQueryArrayResponseDto = Array<ReleaseRawQueryResponseDto>;
