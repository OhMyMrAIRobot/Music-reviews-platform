export class PreferredResponseDto {
  user_id: string;
  artists: PreferredItem[] | null;
  producers: PreferredItem[] | null;
  tracks: PreferredItem[] | null;
  albums: PreferredItem[] | null;
}

class PreferredItem {
  id: string;
  name: string;
  image: string;
}

export class QueryPreferredResponseDto extends Array<PreferredResponseDto> {}
