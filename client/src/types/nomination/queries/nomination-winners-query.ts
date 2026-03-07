/**
 * Query parameters for listing nomination winners.
 *
 * Supports filtering by year and month. All fields are optional.
 */
export type NominationWinnersQuery = {
  /**
   * Optional year filter. When provided the response will be limited to
   * the specified year.
   */
  year?: number;

  /**
   * Optional month filter (1-12). When provided the response will be
   * limited to the specified month within `year` if `year` is provided.
   */
  month?: number;
};
