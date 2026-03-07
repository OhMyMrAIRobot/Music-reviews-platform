import axios from "axios";
import {
  AdminCreateReleaseMediaData,
  AdminUpdateReleaseMediaData,
  CreateReleaseMediaData,
  ReleaseMedia,
  ReleaseMediaQuery,
  ReleaseMediaResponse,
  ReleaseMediaStatus,
  ReleaseMediaType,
  UpdateReleaseMediaData,
} from "../../types/release";
import { api } from "../api-instance";

const _api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/`,
  headers: {
    "Content-type": "application/json",
  },
});

/**
 * API service for managing release media.
 * Provides methods for fetching media statuses and types, retrieving media lists,
 * and performing CRUD operations on release media entries, including admin operations.
 */
export const ReleaseMediaAPI = {
  /**
   * Fetches all available release media statuses from the server.
   *
   * @returns {Promise<ReleaseMediaStatus[]>} A promise that resolves to an array of media statuses.
   */
  async fetchStatuses(): Promise<ReleaseMediaStatus[]> {
    const { data } = await _api.get<ReleaseMediaStatus[]>(
      "/release-media-statuses",
    );
    return data;
  },

  /**
   * Fetches all available release media types from the server.
   *
   * @returns {Promise<ReleaseMediaType[]>} A promise that resolves to an array of media types.
   */
  async fetchTypes(): Promise<ReleaseMediaType[]> {
    const { data } = await _api.get<ReleaseMediaType[]>("/release-media-types");
    return data;
  },

  /**
   * Fetches a paginated list of release media with optional filtering and sorting.
   *
   * @param {ReleaseMediaQuery} query - The query parameters for filtering media.
   * @param {string} [query.statusId] - Filter media by status ID.
   * @param {string} [query.typeId] - Filter media by type ID.
   * @param {string} [query.releaseId] - Filter media by release ID.
   * @param {string} [query.userId] - Filter media by user ID.
   * @param {string} [query.search] - Search term to filter media by content.
   * @param {string} [query.order] - Sort order for the media.
   * @param {number} [query.limit] - Maximum number of media entries to return.
   * @param {number} [query.offset] - Number of media entries to skip (for pagination).
   * @returns {Promise<ReleaseMediaResponse>} A promise that resolves to the media list response containing items and metadata.
   */
  async findAll(query: ReleaseMediaQuery): Promise<ReleaseMediaResponse> {
    const {
      statusId,
      typeId,
      releaseId,
      userId,
      search,
      order,
      limit,
      offset,
    } = query;

    const { data } = await _api.get<ReleaseMediaResponse>(
      `/release-media?
			${statusId ? `statusId=${statusId}&` : ""}
			${typeId ? `typeId=${typeId}&` : ""}
			${releaseId ? `releaseId=${releaseId}&` : ""}
			${userId ? `userId=${userId}&` : ""}
			${search ? `search=${search}&` : ""}
			${order ? `order=${order}&` : ""}
			${limit ? `limit=${limit}&` : ""}
			${offset ? `offset=${offset}` : ""}
			`,
    );
    return data;
  },

  /**
   * Creates a new release media entry.
   *
   * @param {CreateReleaseMediaData} formData - The data required to create the media entry.
   * @returns {Promise<ReleaseMedia>} A promise that resolves to the newly created release media object.
   */
  async create(formData: CreateReleaseMediaData): Promise<ReleaseMedia> {
    const { data } = await api.post<ReleaseMedia>(`/release-media`, formData);

    return data;
  },

  /**
   * Updates an existing release media entry.
   *
   * @param {string} id - The ID of the media entry to update.
   * @param {UpdateReleaseMediaData} updateData - The data to update the media entry with.
   * @returns {Promise<ReleaseMedia>} A promise that resolves to the updated release media object.
   */
  async update(
    id: string,
    updateData: UpdateReleaseMediaData,
  ): Promise<ReleaseMedia> {
    const { data } = await api.patch<ReleaseMedia>(
      `/release-media/${id}`,
      updateData,
    );

    return data;
  },

  /**
   * Deletes a release media entry by ID.
   *
   * @param {string} id - The ID of the media entry to delete.
   */
  async delete(id: string) {
    return api.delete(`/release-media/${id}`);
  },

  /**
   * Creates a new release media entry as an admin user.
   *
   * @param {AdminCreateReleaseMediaData} formData - The data required to create the media entry.
   * @returns {Promise<ReleaseMedia>} A promise that resolves to the newly created release media object.
   */
  async adminCreate(
    formData: AdminCreateReleaseMediaData,
  ): Promise<ReleaseMedia> {
    const { data } = await api.post<ReleaseMedia>(
      `admin/release-media`,
      formData,
    );

    return data;
  },

  /**
   * Updates an existing release media entry as an admin user.
   *
   * @param {string} id - The ID of the media entry to update.
   * @param {AdminUpdateReleaseMediaData} formData - The data to update the media entry with.
   * @returns {Promise<ReleaseMedia>} A promise that resolves to the updated release media object.
   */
  async adminUpdate(
    id: string,
    formData: AdminUpdateReleaseMediaData,
  ): Promise<ReleaseMedia> {
    const { data } = await api.patch<ReleaseMedia>(
      `admin/release-media/${id}`,
      formData,
    );

    return data;
  },

  /**
   * Deletes a release media entry by ID as an admin user.
   *
   * @param {string} id - The ID of the media entry to delete.
   */
  async adminDelete(id: string) {
    return api.delete(`admin/release-media/${id}`);
  },
};
