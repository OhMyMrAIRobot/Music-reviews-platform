class ReleaseDetailsAuthor {
  id: string;
  img: string;
  name: string;
}

export class FindReleaseDetailsResponseDto {
  id: string;
  title: string;
  year: number;
  img: string;
  releaseType: string;
  artists: ReleaseDetailsAuthor[];
  producers: ReleaseDetailsAuthor[];
  designers: ReleaseDetailsAuthor[];
  favCount: number;
  userFavRelease: { userId: string; releaseId: string }[];
  ratings: { type: string; total: number }[];
  ratingDetails: {
    type: string;
    details: {
      rhymes: number;
      structure: number;
      atmosphere: number;
      realization: number;
      individuality: number;
    };
  }[];
  nominationTypes: string[];
}

export class QueryReleaseDetailResponseDto extends Array<FindReleaseDetailsResponseDto> {}
