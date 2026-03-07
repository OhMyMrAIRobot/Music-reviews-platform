import { AlbumValue } from "../entities";

/**
 * Standard paginated response shape for album values endpoints.
 *
 * `meta` contains pagination metadata while `items` holds the current page
 * of `AlbumValue` objects.
 */
export type AlbumValuesResponse = {
  meta: MetaInfo;
  items: AlbumValue[];
};

/** Basic pagination / collection metadata. */
type MetaInfo = {
  /** Total number of items available for the current query. */
  count: number;
};
