import axios from "axios";
import { Lyrics } from "../types/release";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const _api = axios.create({
  baseURL: `${SERVER_URL}/lyrics/`,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export const LyricsApi = {
  async fetchLyrics(releaseId: string): Promise<Lyrics> {
    const { data } = await _api.get<Lyrics>(releaseId);
    return data;
  },
};
