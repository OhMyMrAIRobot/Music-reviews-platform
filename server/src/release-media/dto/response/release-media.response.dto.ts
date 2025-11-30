import { ReleaseMediaDto } from './release-media.dto';

/**
 * Standard response wrapper returned by listing endpoints for release media.
 *
 * Contains `meta` information about the result set and an `items` array
 * with the payload entries.
 */
export type ReleaseMediaResponseDto = {
  /** Pagination / collection metadata */
  meta: MetaInfo;

  /** Array of release media DTOs */
  items: ReleaseMediaDto[];
};

/** Meta information included with list responses. */
type MetaInfo = {
  /** Total number of records matching the query */
  count: number;
};
