/**
 * Short user summary returned with a review
 * */
export type ReviewUser = {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  rank: number | null;
};
