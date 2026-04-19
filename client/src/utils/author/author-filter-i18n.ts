import type { TFunction } from 'i18next';
import { AuthorTypesFilterOptions } from '../../types/author';
import { translateAuthorType } from './author-type-label';

export function translateAuthorTypesFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === AuthorTypesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateAuthorType(t, option);
}
