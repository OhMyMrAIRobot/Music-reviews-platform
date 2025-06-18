export class ReleaseDetailsResponseDto {
  id: string;
  title: string;
  year: number;
  release_img: string;
  release_type: string;
  artists:
    | [
        {
          id: string;
          img: string;
          name: string;
        },
      ]
    | null;
  producers:
    | [
        {
          id: string;
          img: string;
          fd;
          name: string;
        },
      ]
    | null;
  designers:
    | [
        {
          id: string;
          img: string;
          name: string;
        },
      ]
    | null;
  likes_count: number;
  user_fav_ids: { userId: string; releaseId: string }[];
  ratings: { type: string; total: number }[];
  rating_details: {
    type: string;
    details: {
      rhymes: number;
      structure: number;
      atmosphere: number;
      realization: number;
      individuality: number;
      release_rating_id: string;
    };
  }[];
}

export class QueryReleaseDetailResponseDto extends Array<ReleaseDetailsResponseDto> {}
