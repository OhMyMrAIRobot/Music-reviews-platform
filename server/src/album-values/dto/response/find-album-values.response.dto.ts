import { AlbumValueResponseDto } from './album-value.response.dto';

export class FindAlbumValuesResponseDto {
  count: number;
  values: AlbumValueResponseDto[];
}
