export class ProfileResponseDto {
  id: string;
  nickname: string;
  createdAt: string;
  bio: string | null;
  avatar: string;
  cover: string;
  points: number;
  position: number | null;
  role: string;
  textCount: number;
  noTextCount: number;
  receivedLikes: number;
  givenLikes: number;
  social: { id: string; url: string; name: string }[];
}

export class QueryProfileResponseDto extends Array<ProfileResponseDto> {}
