import { ReleaseResponseData } from './release.response.dto';

export class TopRatingReleasesResponseDto {
  minYear: number;
  maxYear: number;
  releases: ReleaseResponseData[];
}
