import { AlbumValuesResponseDto } from '../dto/response/album-values.response.dto';

/**
 * Wrapper used by raw SQL queries that return a single `result` object.
 *
 * Several repository/service methods use a raw query that returns a JSON
 * object with the `result` key containing the paginated album values payload.
 */
export type AlbumValuesRawQueryDto = {
  result: AlbumValuesResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type AlbumValuesRawQueryArrayDto = Array<AlbumValuesRawQueryDto>;
