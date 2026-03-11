/**
 * Represents available sort field for review
 */
export const ReviewSortFields = Object.freeze({
  NEW: 'Новые',
  OLD: 'Старые',
} as const);

/**
 * Represents available sort field for review in release details page
 */
export const ReleaseReviewSortFields = Object.freeze({
  NEW: 'Новые',
  OLD: 'Старые',
  POPULAR: 'Популярные',
} as const);
