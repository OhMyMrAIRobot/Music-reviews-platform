export class PreferredResponseDto {
  user_id: string;
  artists: PreferredItem[];
  producers: PreferredItem[];
  tracks: PreferredItem[];
  albums: PreferredItem[];
}

class PreferredItem {
  id: string;
  name: string;
  image: string;
}

export class QueryPreferredResponseDto extends Array<PreferredResponseDto> {}
