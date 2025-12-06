/**
 * ReviewDto
 *
 * Plain object returned by review endpoints. Includes basic review
 * metadata, aggregated numeric values, author/user info and related
 * release summary. Designed to be serializable as JSON.
 */
export type ReviewDto = {
  /** Review entity id */
  id: string | null;

  /** Review title */
  title: string | null;

  /** Review text */
  text: string;

  /** Numerical review values and computed total score */
  values: ReviewValues;

  /** Short user summary for the review author */
  user: User;

  /** Short release summary the review targets */
  release: Release;

  /**
   * List of users who favorited this review.
   */
  userFavReview: UserFavReview[];

  /**
   * List of registered authors who favourited this review.
   */
  authorFavReview: AuthorFavReview[];

  /** ISO timestamp when the review was created */
  createdAt: string;
};

/** Aggregated numeric values inside a review */
type ReviewValues = {
  total: number;
  rhymes: number;
  structure: number;
  realization: number;
  individuality: number;
  atmosphere: number;
};

/** Representing a user favoriting a review. */
type UserFavReview = {
  userId: string;
  reviewId: string;
};

/** Short user summary returned with a review */
type User = {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  rank: number | null;
};

/** Short release summary returned with a review */
type Release = {
  id: string;
  title: string;
  img: string;
};

/** Author favorite representation attached to a review */
type AuthorFavReview = {
  userId: string;
  avatar: string;
  nickname: string;
  reviewId: string;
};
