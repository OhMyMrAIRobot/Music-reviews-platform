import type { TFunction } from 'i18next';
import { AuthorTypesEnum } from '../../types/author/enums/author-types-enum';
import { resolveBackendEnumKey } from '../i18n/resolve-backend-enum-key';

const AUTHOR_TYPE_I18N_KEYS: Record<
  keyof typeof AuthorTypesEnum,
  'author.types.artist' | 'author.types.producer' | 'author.types.designer'
> = {
  ARTIST: 'author.types.artist',
  PRODUCER: 'author.types.producer',
  DESIGNER: 'author.types.designer',
};

export function translateAuthorType(t: TFunction, type: string): string {
  const key = resolveBackendEnumKey(AuthorTypesEnum, type);
  if (key !== undefined) {
    return t(AUTHOR_TYPE_I18N_KEYS[key]);
  }
  return type;
}
