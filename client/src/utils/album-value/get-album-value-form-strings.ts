import { albumValueFormStringsEn } from './album-value-form-strings.en';
import { albumValueFormStringsRu } from './album-value-form-strings.ru';
import type { AlbumValueFormStrings } from './album-value-form-strings.types';

export function getAlbumValueFormStrings(
  language: string
): AlbumValueFormStrings {
  return language.startsWith('ru')
    ? albumValueFormStringsRu
    : albumValueFormStringsEn;
}
