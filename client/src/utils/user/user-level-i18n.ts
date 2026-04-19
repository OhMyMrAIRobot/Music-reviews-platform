import type { TFunction } from 'i18next';

export function translateUserLevelName(t: TFunction, level: string): string {
  switch (level) {
    case 'silver':
      return t('userLevel.silver');
    case 'gold':
      return t('userLevel.gold');
    case 'emerald':
      return t('userLevel.emerald');
    case 'sapphire':
      return t('userLevel.sapphire');
    case 'ruby':
      return t('userLevel.ruby');
    default:
      return level;
  }
}
