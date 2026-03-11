import axios from 'axios';
import { SocialMedia } from '../types/social-media';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const _api = axios.create({
  baseURL: `${SERVER_URL}/social-media`,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * API service for social media links and platforms.
 * Provides methods for fetching social media information.
 */
export const SocialMediaAPI = {
  /**
   * Fetches all available social media platforms and links.
   *
   * @returns {Promise<SocialMedia[]>} A promise that resolves to an array of social media objects.
   */
  async findAll(): Promise<SocialMedia[]> {
    const { data } = await _api.get<SocialMedia[]>('/');
    return data;
  },
};
