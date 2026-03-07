/* eslint-disable */
import axios from 'axios';

const searchUrl = 'https://api.genius.com/search?q=';

interface IOptions {
  title: string;
  artists: string[];
}

const getTitle = (title: string, artists: string[]) => {
  return `${title} ${artists.join(' ')}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, '')
    .replace(/ *\[[^\]]*]/, '')
    .replace(/feat.|ft./g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const searchGeniusSong = async (
  options: IOptions,
): Promise<string | null> => {
  const { title, artists } = options;
  const query = getTitle(title, artists);

  const reqUrl = `${searchUrl}${encodeURIComponent(query)}`;
  const headers = {
    Authorization: 'Bearer ' + process.env.GENIUS_API_TOKEN,
  };

  const { data } = await axios.get(reqUrl, { headers });
  let result: string | null = null;

  data.response.hits.forEach((song) => {
    const fullTitle = song.result.full_title.toLowerCase();

    let matchTitle = false;
    if (fullTitle.includes(title.toLowerCase())) {
      result ??= song.result.url;
      matchTitle = true;
    }

    if (matchTitle) {
      for (const artist of artists) {
        if (fullTitle.includes(artist.toLowerCase())) {
          return song.result.url;
        }
      }
    }
  });

  return result;
};
