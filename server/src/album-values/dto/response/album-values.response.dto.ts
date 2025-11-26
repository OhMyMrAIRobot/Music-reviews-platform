import { AlbumValueDto } from './album-value.dto';

/**
 * Standard paginated response shape for album values endpoints.
 *
 * `meta` contains pagination metadata while `items` holds the current page
 * of `AlbumValueDto` objects.
 */
export type AlbumValuesResponseDto = {
  meta: MetaInfo;
  items: AlbumValueDto[];
};

/** Basic pagination / collection metadata. */
type MetaInfo = {
  /** Total number of items available for the current query. */
  count: number;
};
