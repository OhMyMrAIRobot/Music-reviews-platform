/**
 * ReviewSortFieldsEnum
 *
 * Fields that can be used to sort review lists. The enum values map to
 * the database-side sorting logic implemented in the raw SQL used by
 * the reviews service.
 */
export enum ReviewSortFieldsEnum {
  /** Sort by review creation timestamp. */
  CREATED = 'created',

  /** Sort by number of likes/favorites the review has received. */
  LIKES = 'likes',
}
