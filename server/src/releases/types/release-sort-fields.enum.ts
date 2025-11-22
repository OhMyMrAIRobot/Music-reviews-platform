/**
 * ReleaseSortFieldsEnum — enumeration of fields that can be used to sort
 * the releases list. Values are consumed by the SQL aggregator to select
 * the appropriate sorting expression.
 */
export enum ReleaseSortFieldsEnum {
  /** Sort by publication date */
  PUBLISHED = 'published',
  /** Number of reviews without text */
  WITHOUT_TEXT_COUNT = 'withoutTextCount',
  /** Number of reviews with text */
  TEXT_COUNT = 'textCount',
  /** Rating by media reviews */
  MEDIA_RATING = 'mediaRating',
  /** Total count (withText + withoutText) */
  TOTAL_COUNT = 'totalCount',
  /** Rating without text */
  WITHOUT_TEXT_RATING = 'withoutTextRating',
  /** Rating with text */
  WITH_TEXT_RATING = 'withTextRating',
  /** Aggregate rating (all types combined) */
  ALL_RATING = 'allRating',
}
