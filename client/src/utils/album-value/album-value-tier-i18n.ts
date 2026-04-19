import type { TFunction } from 'i18next';
import type { AlbumValueTiersEnum } from '../../types/album-value/enums/album-value-tiers-enum';

export function translateAlbumValueTierName(
  t: TFunction,
  tier: AlbumValueTiersEnum
): string {
  return t(`albumValue.tiers.${tier}`);
}
