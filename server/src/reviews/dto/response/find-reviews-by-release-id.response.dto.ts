export class FindReviewsByReleaseIdResponseDto {
  count: number;
  reviews: ReleaseReview[];
}

export class ReleaseReview {
  id: string;
  title: string;
  text: string;
  total: number;
  rhymes: number;
  structure: number;
  realization: number;
  individuality: number;
  atmosphere: number;
  createdAt: string;
  userId: string;
  points: number;
  nickname: string;
  avatar: string;
  position: number | null;
  favCount: number;
  userFavReview: { userId: string; reviewId: string }[];
}
