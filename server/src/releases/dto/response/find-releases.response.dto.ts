export class FindReleasesResponseDto {
  count: number;
  releases: ReleaseResponseData[];
}

export class ReleaseResponseData {
  id: string;
  title: string;
  img: string;
  releaseType: string;
  textCount: number;
  withoutTextCount: number;
  authors: { id: string; name: string }[];
  ratings: { type: string; total: number }[];
  hasAuthorLikes: boolean;
  hasAuthorComments: boolean;
}
