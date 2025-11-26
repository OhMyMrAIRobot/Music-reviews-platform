/**
 * Aggregated platform counters.
 *
 * Each property represents a single numeric counter aggregated in the
 * database summary view `platform_counters_summary`.
 */
export class PlatformStatsResponseDto {
  /** Total number of registered users on the platform. */
  totalUsers: number;

  /** Number of registered authors (profiles marked as authors). */
  registeredAuthors: number;

  /** Total number of author "likes" recorded across the platform. */
  authorLikes: number;

  /** Number of comments left on authors. */
  authorComments: number;

  /** Total number of individual tracks in the database. */
  totalTracks: number;

  /** Total number of album releases in the database. */
  totalAlbums: number;

  /** Number of media-level reviews. */
  mediaReviews: number;

  /** Number of textual reviews (with text content). */
  reviews: number;

  /** Number of ratings left without accompanying text. */
  withoutTextRatings: number;
}
