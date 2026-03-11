import { UserFavRelease } from '../../types/release';
import { api } from '../api-instance';

/**
 * API service for managing user favorite releases.
 * Provides methods for adding and removing releases from the user's favorites list.
 */
export const UserFavReleaseAPI = {
  /**
   * Adds a release to the current user's favorites list.
   *
   * @param {string} releaseId - The ID of the release to add to favorites.
   * @returns {Promise<UserFavRelease>} A promise that resolves to the user favorite release relationship object.
   */
  async addToFav(releaseId: string): Promise<UserFavRelease> {
    const { data } = await api.post<UserFavRelease>(
      `/user-fav-releases/${releaseId}`
    );
    return data;
  },

  /**
   * Removes a release from the current user's favorites list.
   *
   * @param {string} releaseId - The ID of the release to remove from favorites.
   * @returns {Promise<UserFavRelease>} A promise that resolves to the user favorite release relationship object.
   */
  async deleteFromFav(releaseId: string): Promise<UserFavRelease> {
    const { data } = await api.delete<UserFavRelease>(
      `/user-fav-releases/${releaseId}`
    );
    return data;
  },
};
