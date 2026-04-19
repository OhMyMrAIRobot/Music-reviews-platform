import type { TFunction } from 'i18next';
import { AuthorTypesEnum } from '../../types/author/enums/author-types-enum';

export function translateAuthorType(t: TFunction, type: string): string {
  switch (type) {
    case AuthorTypesEnum.ARTIST:
      return t('author.types.artist');
    case AuthorTypesEnum.PRODUCER:
      return t('author.types.producer');
    case AuthorTypesEnum.DESIGNER:
      return t('author.types.designer');
    default:
      return type;
  }
}
