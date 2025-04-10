export class ReleaseReviewResponseDto {
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
  created_at: string;
  user_id: string;
  points: number;
  nickname: string;
  avatar: string;
  position: number | null;
  likes_count: number;
  user_like_ids: [
    {
      user_id: string | null;
    },
  ];
}
