import { ReleaseDto } from './release.dto';

/**
 * MetaInfo — metadata about the query result (aggregates and bounds).
 */
type MetaInfo = {
  /** Total number of releases matching the filters */
  count: number;
  /** Minimum publish year among results or null */
  minYearRelease: number | null;
  /** Maximum publish year among results or null */
  maxYearRelease: number | null;
};

/**
 * ReleasesResponseDto — standard response for releases list endpoints.
 * `items` contains an array of `ReleaseDto`, `meta` contains aggregated info.
 */
export type ReleasesResponseDto = {
  meta: MetaInfo;
  items: ReleaseDto[];
};
