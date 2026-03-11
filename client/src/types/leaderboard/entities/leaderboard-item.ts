/**
 * Represents a single item in the leaderboard, including user info and stats.
 */
export type LeaderboardItem = {
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
