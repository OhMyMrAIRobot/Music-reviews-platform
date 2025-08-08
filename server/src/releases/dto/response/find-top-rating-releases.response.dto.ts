import { ReleaseResponseData } from './find-releases.response.dto';

export class FindTopRatingReleasesResponseDto {
  minYear: number;
  maxYear: number;
  releases: ReleaseResponseData[];
}
