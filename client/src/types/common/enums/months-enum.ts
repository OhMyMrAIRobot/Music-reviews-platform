/**
 * Frozen object representing months of the year, mapping month numbers to their Russian names.
 * Keys are month numbers (1-12), values are month names in Russian.
 */
export const MonthsEnum = Object.freeze({
  1: 'Январь',
  2: 'Февраль',
  3: 'Март',
  4: 'Апрель',
  5: 'Май',
  6: 'Июнь',
  7: 'Июль',
  8: 'Август',
  9: 'Сентябрь',
  10: 'Октябрь',
  11: 'Ноябрь',
  12: 'Декабрь',
});

/**
 * Type representing the keys of MonthsEnum, which are the month numbers (1-12).
 */
export type MonthEnumType = keyof typeof MonthsEnum;
