import type { TFunction } from 'i18next';
import type { MonthEnumType } from '../../types/common/enums/months-enum';

export function translateMonth(
  t: TFunction,
  month: MonthEnumType | number
): string {
  return t(`date.months.${month}`);
}

export function getTranslatedMonthNames(t: TFunction): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    translateMonth(t, (i + 1) as MonthEnumType)
  );
}
