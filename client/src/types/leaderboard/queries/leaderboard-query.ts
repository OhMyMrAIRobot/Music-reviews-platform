/**
 * Query parameters for listing leaderboard.
 *
 * Supports pagination (limit/offset). All fields are optional.
 */
export class LeaderboardQuery {
  /** Pagination limit (integer). */
  limit?: number;

  /** Pagination offset (integer). */
  offset?: number;
}
