import type { TFunction } from 'i18next';
import { AlbumValueSortOptions } from '../../types/album-value/helpers/filter';

export function translateAlbumValueSortOption(
  t: TFunction,
  option: string
): string {
  if (option === AlbumValueSortOptions.ASC) return t('albumValue.sort.asc');
  if (option === AlbumValueSortOptions.DESC) return t('albumValue.sort.desc');
  return option;
}
