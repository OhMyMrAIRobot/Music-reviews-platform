export class ReleaseResponseDto {
  count: number;
  releases: ReleaseResponseData[];
}

export class ReleaseResponseData {
  id: string;
  title: string;
  img: string;
  release_type: string;
  text_count: number;
  no_text_count: number;
  author: { id: string; name: string }[];
  ratings: { type: string; total: number }[];
}
