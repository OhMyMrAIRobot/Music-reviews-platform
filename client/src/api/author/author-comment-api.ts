import axios from 'axios';
import {
  AuthorComment,
  AuthorCommentsQuery,
  AuthorCommentsResponse,
  CreateAuthorCommentData,
  UpdateAuthorCommentData,
} from '../../types/author';
import { api } from '../api-instance';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const _api = axios.create({
  baseURL: `${SERVER_URL}/author-comments/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * API service for managing author comments.
 * Provides methods for creating, reading, updating, and deleting author comments,
 * including both user-facing and admin operations.
 */
export const AuthorCommentAPI = {
  /**
   * Creates a new author comment.
   *
   * @param {CreateAuthorCommentData} formData - The data required to create the comment.
   * @returns {Promise<AuthorComment>} A promise that resolves to the newly created author comment.
   */
  async create(formData: CreateAuthorCommentData): Promise<AuthorComment> {
    const { data } = await api.post<AuthorComment>('author-comments', formData);

    return data;
  },

  /**
   * Fetches a paginated list of author comments with optional filtering and sorting.
   *
   * @param {AuthorCommentsQuery} query - The query parameters for filtering comments.
   * @param {string} [query.releaseId] - Filter comments by release ID.
   * @param {string} [query.search] - Search term to filter comments by content.
   * @param {string} [query.sortOrder] - Sort order for the comments (e.g., 'ASC' or 'DESC').
   * @param {number} [query.limit] - Maximum number of comments to return.
   * @param {number} [query.offset] - Number of comments to skip (for pagination).
   * @returns {Promise<AuthorCommentsResponse>} A promise that resolves to the comments list response containing items and metadata.
   */
  async findAll(query: AuthorCommentsQuery): Promise<AuthorCommentsResponse> {
    const { releaseId, search, sortOrder, limit, offset } = query;

    const { data } = await _api.get<AuthorCommentsResponse>(`?
			${releaseId ? `releaseId=${releaseId}&` : ''}
			${search ? `search=${search}&` : ''}	
			${sortOrder ? `sortOrder=${sortOrder}&` : ''}	
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}	
		`);

    return data;
  },

  /**
   * Updates an existing author comment.
   *
   * @param {string} id - The ID of the comment to update.
   * @param {UpdateAuthorCommentData} formData - The data to update the comment with.
   * @returns {Promise<AuthorComment>} A promise that resolves to the updated author comment.
   */
  async update(
    id: string,
    formData: UpdateAuthorCommentData
  ): Promise<AuthorComment> {
    const { data } = await api.patch<AuthorComment>(
      `author-comments/${id}`,
      formData
    );

    return data;
  },

  /**
   * Deletes an author comment by ID.
   *
   * @param {string} id - The ID of the comment to delete.
   */
  async delete(id: string) {
    return api.delete(`author-comments/${id}`);
  },

  /**
   * Updates an author comment as an admin user.
   *
   * @param {string} id - The ID of the comment to update.
   * @param {UpdateAuthorCommentData} formData - The data to update the comment with.
   * @returns {Promise<AuthorComment>} A promise that resolves to the updated author comment.
   */
  async adminUpdate(
    id: string,
    formData: UpdateAuthorCommentData
  ): Promise<AuthorComment> {
    const { data } = await api.patch<AuthorComment>(
      `admin/author-comments/${id}`,
      formData
    );

    return data;
  },

  /**
   * Deletes an author comment by ID as an admin user.
   *
   * @param {string} id - The ID of the comment to delete.
   */
  async adminDelete(id: string) {
    return api.delete(`admin/author-comments/${id}`);
  },
};
