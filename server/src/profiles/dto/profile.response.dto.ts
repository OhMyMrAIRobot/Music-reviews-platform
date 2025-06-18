export class ProfileResponseDto {
  id: string;
  nickname: string;
  created_at: string;
  bio: string;
  avatar: string;
  cover: string;
  points: number;
  position: number | null;
  text_count: number;
  no_text_count: number;
  received_likes: number;
  given_likes: number;
  social: { url: string | null; name: string | null }[];
}

export class QueryProfileResponseDto extends Array<ProfileResponseDto> {}
