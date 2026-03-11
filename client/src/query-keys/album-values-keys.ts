import { AlbumValuesQuery } from '../types/album-value';

export const albumValuesKeys = {
  all: ['albumValues'] as const,
  list: (params: AlbumValuesQuery) => ['albumValues', 'list', params] as const,
  byRelease: (releaseId: string) =>
    ['albumValues', 'byRelease', releaseId] as const,
  user: (params: { releaseId: string; userId: string }) =>
    ['albumValues', 'user', params] as const,
};
