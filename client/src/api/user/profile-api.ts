import axios from 'axios';
import {
  Profile,
  ProfilePreferencesResponse,
  UpdateProfileData,
} from '../../types/profile';
import { api } from '../api-instance';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const _api = axios.create({
  baseURL: `${SERVER_URL}/profiles/`,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * API service for managing user profiles.
 * Provides methods for retrieving and updating user profiles and preferences,
 * including admin operations.
 */
export const ProfileAPI = {
  /**
   * Fetches a user profile by user ID.
   *
   * @param {string} userId - The ID of the user whose profile to retrieve.
   * @returns {Promise<Profile>} A promise that resolves to the user profile object.
   */
  async findByUserId(userId: string): Promise<Profile> {
    const { data } = await _api.get<Profile>(`/user/${userId}`);

    return data;
  },

  /**
   * Fetches the preferences for a user profile by user ID.
   *
   * @param {string} userId - The ID of the user whose preferences to retrieve.
   * @returns {Promise<ProfilePreferencesResponse>} A promise that resolves to the user profile preferences response.
   */
  async findPreferences(userId: string): Promise<ProfilePreferencesResponse> {
    const { data } = await _api.get<ProfilePreferencesResponse>(
      `/user/${userId}/preferences`
    );

    return data;
  },

  /**
   * Updates the current user's profile with the provided form data.
   *
   * @param {FormData} formData - The form data containing updated profile information (image, bio, etc.).
   * @returns {Promise<Profile>} A promise that resolves to the updated profile object.
   */
  async update(formData: FormData): Promise<Profile> {
    const { data } = await api.patch<Profile>('/profiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  /**
   * Updates a user profile as an admin user.
   *
   * @param {string} userId - The ID of the user whose profile to update.
   * @param {UpdateProfileData} profileData - The data to update the profile with.
   * @returns {Promise<UpdateProfileData>} A promise that resolves to the updated profile data.
   */
  async adminUpdate(
    userId: string,
    profileData: UpdateProfileData
  ): Promise<UpdateProfileData> {
    const { data } = await api.patch<UpdateProfileData>(
      `/profiles/user/${userId}`,
      profileData
    );

    return data;
  },
};
