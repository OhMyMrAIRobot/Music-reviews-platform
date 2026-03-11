import axios from 'axios';
import {
  Author,
  AuthorsQuery,
  AuthorsResponse,
  AuthorType,
} from '../../types/author';
import { api } from '../api-instance';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const _api = axios.create({
  baseURL: `${SERVER_URL}/authors/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * API service for managing authors.
 * Provides methods for fetching, creating, updating, and deleting authors,
 * as well as retrieving available author types.
 */
export const AuthorAPI = {
  /**
   * Fetches all available author types from the server.
   *
   * @returns {Promise<AuthorType[]>} A promise that resolves to an array of author types.
   */
  async fetchAuthorTypes(): Promise<AuthorType[]> {
    const { data } = await axios.get<AuthorType[]>(
      `${SERVER_URL}/author-types`
    );
    return data;
  },

  /**
   * Fetches a paginated list of authors with optional filtering and search.
   *
   * @param {AuthorsQuery} query - The query parameters for filtering authors.
   * @param {string} [query.typeId] - Filter authors by type ID.
   * @param {string} [query.search] - Search term to filter authors by name.
   * @param {number} [query.limit] - Maximum number of authors to return.
   * @param {number} [query.offset] - Number of authors to skip (for pagination).
   * @param {boolean} [query.onlyRegistered] - If true, return only registered users who are authors.
   * @param {string} [query.userId] - Filter authors by user ID.
   * @returns {Promise<AuthorsResponse>} A promise that resolves to the authors list response containing items and metadata.
   */
  async findAll(query: AuthorsQuery): Promise<AuthorsResponse> {
    const { typeId, search, limit, offset, onlyRegistered, userId } = query;

    const { data } = await _api.get<AuthorsResponse>(
      `/?
			${typeId ? `typeId=${typeId}&` : ''}
			${search ? `search=${search}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			${onlyRegistered ? `onlyRegistered=${onlyRegistered}&` : ''}
			${userId ? `userId=${userId}` : ''}
			`
    );

    return data;
  },

  /**
   * Fetches a single author by ID.
   *
   * @param {string} id - The ID of the author to retrieve.
   * @returns {Promise<Author>} A promise that resolves to the author object.
   */
  async findById(id: string): Promise<Author> {
    const { data } = await _api.get<Author>(`/${id}`);

    return data;
  },

  /**
   * Creates a new author with the provided form data.
   *
   * @param {FormData} formData - The form data containing author information (image, name, etc.).
   * @returns {Promise<Author>} A promise that resolves to the newly created author object.
   */
  async createAuthor(formData: FormData): Promise<Author> {
    const { data } = await api.post<Author>('/authors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Updates an existing author with the provided form data.
   *
   * @param {string} id - The ID of the author to update.
   * @param {FormData} formData - The form data containing updated author information.
   * @returns {Promise<Author>} A promise that resolves to the updated author object.
   */
  async updateAuthor(id: string, formData: FormData): Promise<Author> {
    const { data } = await api.patch<Author>(`/authors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Deletes an author by ID.
   *
   * @param {string} id - The ID of the author to delete.
   */
  async deleteAuthor(id: string) {
    return api.delete(`/authors/${id}`);
  },
};
