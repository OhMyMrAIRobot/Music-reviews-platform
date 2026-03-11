import { Release } from '../entities/release';

/**
 * ReleasesResponse — response structure for a releases query.
 */
export type ReleasesResponse = {
  /**
   * MetaInfo — metadata about the query result.
   */
  meta: MetaInfo;

  /** Array of Release entities */
  items: Release[];
};

type MetaInfo = {
  /** Total number of releases matching the filters */
  count: number;
  /** Minimum publish year among results or null */
  minPublishYear: number | null;
  /** Maximum publish year among results or null */
  maxPublishYear: number | null;
};
