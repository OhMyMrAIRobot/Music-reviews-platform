/**
 * Single leaderboard item returned by the leaderboard query.
 *
 * - `user` contains basic identity and ranking fields
 * - `stats` contains aggregated counters for reviews and likes
 * - `topAuthorLikers` lists top likers who are registered authors
 */
export type LeaderboardItemDto = {
  user: User;
  stats: Stats;
  topAuthorLikers: TopAuthorLiker[];
};

/** Basic user information returned in leaderboard items. */
type User = {
  id: string;
  nickname: string;
  avatar: string;
  cover: string;
  points: number;
  rank: number;
};

/** Aggregated statistics for a leaderboard user. */
type Stats = {
  textCount: number;
  withoutTextCount: number;
  receivedLikes: number;
  givenLikes: number;
  receivedAuthorLikes: number;
};

/** Top likers who are registered authors (count + minimal user info). */
type TopAuthorLiker = {
  count: number;
  user: Pick<User, 'id' | 'nickname' | 'avatar'>;
};
