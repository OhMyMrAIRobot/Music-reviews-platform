import { AuthResponseWithEmailStatus } from '../../types/auth';
import {
  AdminUpdateUserData,
  UpdateUserData,
  UserDetails,
  UsersQuery,
  UsersResponse,
} from '../../types/user';
import { api } from '../api-instance';

/**
 * API service for managing users.
 * Provides methods for retrieving user lists, and performing CRUD operations on users,
 * including admin operations.
 */
export const UserAPI = {
  /**
   * Fetches a paginated list of users with optional filtering and sorting.
   *
   * @param {UsersQuery} query - The query parameters for filtering users.
   * @param {string} [query.search] - Search term to filter users by name or email.
   * @param {string} [query.role] - Filter users by role.
   * @param {string} [query.order] - Sort order for the users.
   * @param {number} [query.limit] - Maximum number of users to return.
   * @param {number} [query.offset] - Number of users to skip (for pagination).
   * @returns {Promise<UsersResponse>} A promise that resolves to the users list response containing items and metadata.
   */
  async findAll(query: UsersQuery): Promise<UsersResponse> {
    const { search, role, order, limit, offset } = query;

    const { data } = await api.get<UsersResponse>(`/users?
			${search ? `search=${search}&` : ''}
			${role ? `role=${role}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`);
    return data;
  },

  /**
   * Fetches a single user by ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserDetails>} A promise that resolves to the user details object.
   */
  async findById(id: string): Promise<UserDetails> {
    const { data } = await api.get<UserDetails>(`/users/${id}`);
    return data;
  },

  /**
   * Updates the current user's information.
   *
   * @param {UpdateUserData} formData - The data to update the user with.
   * @returns {Promise<AuthResponseWithEmailStatus>} A promise that resolves to the updated authentication response with email status.
   */
  async update(formData: UpdateUserData): Promise<AuthResponseWithEmailStatus> {
    const { data } = await api.patch<AuthResponseWithEmailStatus>(
      '/users',
      formData
    );
    return data;
  },

  /**
   * Deletes the current user account.
   */
  async delete() {
    return api.delete(`/users`);
  },

  /**
   * Updates a user as an admin user.
   *
   * @param {string} id - The ID of the user to update.
   * @param {AdminUpdateUserData} updateData - The data to update the user with.
   * @returns {Promise<UserDetails>} A promise that resolves to the updated user details.
   */
  async adminUpdate(
    id: string,
    updateData: AdminUpdateUserData
  ): Promise<UserDetails> {
    const { data } = await api.patch<UserDetails>(`/users/${id}`, updateData);
    return data;
  },

  /**
   * Deletes a user by ID as an admin user.
   *
   * @param {string} id - The ID of the user to delete.
   */
  async adminDelete(id: string) {
    return api.delete(`/users/${id}`);
  },
};
