import axios from "axios";
import {
  Release,
  ReleasesQuery,
  ReleasesResponse,
  ReleaseType,
} from "../../types/release";
import { api } from "../api-instance";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const _api = axios.create({
  baseURL: `${SERVER_URL}/releases/`,
  headers: {
    "Content-type": "application/json",
  },
});

/**
 * API service for managing releases.
 * Provides methods for fetching release types, retrieving release lists,
 * and performing CRUD operations on release entries.
 */
export const ReleaseAPI = {
  /**
   * Fetches all available release types from the server.
   *
   * @returns {Promise<ReleaseType[]>} A promise that resolves to an array of release types.
   */
  async fetchReleaseTypes(): Promise<ReleaseType[]> {
    const { data } = await axios.get<ReleaseType[]>(
      `${SERVER_URL}/release-types`,
    );
    return data;
  },

  /**
   * Fetches a paginated list of releases with optional filtering, sorting, and pagination.
   *
   * @param {ReleasesQuery} query - The query parameters for filtering releases.
   * @param {string} [query.authorId] - Filter releases by author ID.
   * @param {string} [query.typeId] - Filter releases by type ID.
   * @param {string} [query.search] - Search term to filter releases by title or content.
   * @param {string} [query.sortField] - Field to sort releases by.
   * @param {string} [query.sortOrder] - Sort order (e.g., 'ASC' or 'DESC').
   * @param {boolean} [query.last24h] - If true, return only releases from the last 24 hours.
   * @param {number} [query.year] - Filter releases by year.
   * @param {number} [query.month] - Filter releases by month (requires year).
   * @param {number} [query.limit] - Maximum number of releases to return.
   * @param {number} [query.offset] - Number of releases to skip (for pagination).
   * @returns {Promise<ReleasesResponse>} A promise that resolves to the releases list response containing items and metadata.
   */
  async findAll(query: ReleasesQuery): Promise<ReleasesResponse> {
    const { data } = await _api.get<ReleasesResponse>(`?
			${query.authorId ? `authorId=${query.authorId}&` : ""}
			${query.typeId ? `typeId=${query.typeId}&` : ""}
			${query.search ? `search=${query.search}&` : ""}
			${query.sortField ? `sortField=${query.sortField}&` : ""}
			${query.sortOrder ? `sortOrder=${query.sortOrder}&` : ""}
			${query.last24h ? `last24h=${query.last24h}&` : ""}
			${query.year ? `year=${query.year}&` : ""}
			${query.month ? `month=${query.month}&` : ""}
			${query.limit ? `limit=${query.limit}&` : ""}
			${query.offset ? `offset=${query.offset}&` : ""}
		`);
    return data;
  },

  /**
   * Fetches a single release by ID.
   *
   * @param {string} id - The ID of the release to retrieve.
   * @returns {Promise<Release>} A promise that resolves to the release object.
   */
  async fetchById(id: string): Promise<Release> {
    const { data } = await _api.get<Release>(`${id}`);
    return data;
  },

  /**
   * Creates a new release with the provided form data.
   *
   * @param {FormData} formData - The form data containing release information (image, title, etc.).
   * @returns {Promise<Release>} A promise that resolves to the newly created release object.
   */
  async create(formData: FormData): Promise<Release> {
    const { data } = await api.post<Release>("/releases", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  /**
   * Updates an existing release with the provided form data.
   *
   * @param {string} id - The ID of the release to update.
   * @param {FormData} formData - The form data containing updated release information.
   * @returns {Promise<Release>} A promise that resolves to the updated release object.
   */
  async update(id: string, formData: FormData): Promise<Release> {
    const { data } = await api.patch<Release>(`/releases/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  /**
   * Deletes a release by ID.
   *
   * @param {string} id - The ID of the release to delete.
   */
  async delete(id: string) {
    return api.delete(`/releases/${id}`);
  },
};
