import type { TFunction } from 'i18next';
import { NominationTypesEnum } from '../../types/nomination/enums/nomination-types-enum';
import { resolveBackendEnumKey } from './resolve-backend-enum-key';

export function translateNominationType(t: TFunction, type: string): string {
  const key = resolveBackendEnumKey(NominationTypesEnum, type);
  if (key !== undefined) {
    return t(`enums.nominationType.${String(key)}`);
  }
  return type;
}
