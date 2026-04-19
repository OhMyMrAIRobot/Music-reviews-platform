import type { TFunction } from 'i18next';
import { SearchBarOptionsEnum } from '../../types/common';

export function translateSearchBarOption(t: TFunction, option: string): string {
  switch (option) {
    case SearchBarOptionsEnum.AUTHORS:
      return t('layout.search.authors');
    case SearchBarOptionsEnum.RELEASES:
      return t('layout.search.releases');
    default:
      return option;
  }
}
