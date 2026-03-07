import axios from "axios";
import { LeaderboardItem, LeaderboardQuery } from "../types/leaderboard";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const _api = axios.create({
  baseURL: `${SERVER_URL}/leaderboard/`,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

/**
 * API service for leaderboard data.
 * Provides methods for fetching user leaderboard rankings and statistics.
 */
export const LeaderboardAPI = {
  /**
   * Fetches a paginated list of leaderboard items.
   *
   * @param {LeaderboardQuery} query - The query parameters for pagination.
   * @param {number} [query.limit] - Maximum number of leaderboard items to return.
   * @param {number} [query.offset] - Number of leaderboard items to skip (for pagination).
   * @returns {Promise<LeaderboardItem[]>} A promise that resolves to an array of leaderboard items.
   */
  async fetchLeaderboard(query: LeaderboardQuery): Promise<LeaderboardItem[]> {
    const { limit, offset } = query;

    const { data } = await _api.get<LeaderboardItem[]>(`?
			${limit ? `limit=${limit}&` : ""}
			${offset ? `offset=${offset}&` : ""}
		`);

    return data;
  },
};
