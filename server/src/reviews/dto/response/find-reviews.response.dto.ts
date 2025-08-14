export class FindReviewsResponseDto {
  count: number;
  reviews: ReviewQueryDataDto[];
}

export class ReviewQueryDataDto {
  id: string;
  title: string;
  text: string;
  total: number;
  rhymes: number;
  userId: string;
  structure: number;
  realization: number;
  individuality: number;
  atmosphere: number;
  nickname: string;
  profileImg: string;
  points: number;
  position: number | null;
  releaseImg: string;
  releaseTitle: string;
  releaseId: string;
  favCount: number;
  userFavReview: { userId: string; reviewId: string }[];
  authorFavReview: {
    userId: string;
    avatar: string;
    nickname: string;
    reviewId: string;
  }[];
}
