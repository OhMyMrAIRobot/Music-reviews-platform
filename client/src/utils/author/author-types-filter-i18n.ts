import type { TFunction } from 'i18next';
import { AuthorTypesEnum } from '../../types/author/enums/author-types-enum';
import { AuthorTypesFilterOptions } from '../../types/author/helpers/filter';

export function translateAuthorTypesFilterLabel(
  t: TFunction,
  option: string
): string {
  if (option === AuthorTypesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  if (option === AuthorTypesEnum.ARTIST) {
    return t('author.types.artist');
  }
  if (option === AuthorTypesEnum.PRODUCER) {
    return t('author.types.producer');
  }
  if (option === AuthorTypesEnum.DESIGNER) {
    return t('author.types.designer');
  }
  return option;
}
