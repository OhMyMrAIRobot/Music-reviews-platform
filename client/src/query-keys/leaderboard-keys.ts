import { LeaderboardQuery } from "../types/leaderboard";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: (params: LeaderboardQuery) => ["leaderboard", "list", params] as const,
};
