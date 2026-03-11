import axios from 'axios';
import {
  AuthorLikesQuery,
  AuthorLikesResponse,
  UserFavReview,
} from '../../types/review';
import { api } from '../api-instance';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * API service for managing user favorite reviews and author likes.
 * Provides methods for retrieving author likes and managing favorite reviews.
 */
export const UserFavReviewAPI = {
  /**
   * Fetches a paginated list of author likes.
   *
   * @param {AuthorLikesQuery} query - The query parameters for pagination.
   * @param {number} [query.limit] - Maximum number of author likes to return.
   * @param {number} [query.offset] - Number of author likes to skip (for pagination).
   * @returns {Promise<AuthorLikesResponse>} A promise that resolves to the author likes response containing items and metadata.
   */
  async findAuthorLikes(query: AuthorLikesQuery): Promise<AuthorLikesResponse> {
    const { data } = await axios.get<AuthorLikesResponse>(
      `${SERVER_URL}/user-fav-reviews/author-likes?
			${query.limit ? `limit=${query.limit}&` : ''}
			${query.offset ? `offset=${query.offset}` : ''}`
    );

    return data;
  },

  /**
   * Adds a review to the current user's favorites list.
   *
   * @param {string} reviewId - The ID of the review to add to favorites.
   * @returns {Promise<UserFavReview>} A promise that resolves to the user favorite review relationship object.
   */
  async addToFav(reviewId: string): Promise<UserFavReview> {
    const { data } = await api.post<UserFavReview>(
      `/user-fav-reviews/${reviewId}`
    );
    return data;
  },

  /**
   * Removes a review from the current user's favorites list.
   *
   * @param {string} reviewId - The ID of the review to remove from favorites.
   * @returns {Promise<UserFavReview>} A promise that resolves to the user favorite review relationship object.
   */
  async deleteFromFav(reviewId: string): Promise<UserFavReview> {
    const { data } = await api.delete<UserFavReview>(
      `/user-fav-reviews/${reviewId}`
    );
    return data;
  },
};
