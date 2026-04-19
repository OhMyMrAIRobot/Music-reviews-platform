import type { TFunction } from 'i18next';
import type { ReleaseSortKey } from '../../types/release/helpers/sort';
import { getKeyByLabel } from '../../types/release/helpers/sort-map';

export function translateReleaseSortKey(
  t: TFunction,
  key: ReleaseSortKey
): string {
  return t(`pages.releases.sort.${key}`);
}

export function translateReleaseSortLabel(t: TFunction, label: string): string {
  const key = getKeyByLabel(label);
  if (key) return translateReleaseSortKey(t, key);
  return label;
}
