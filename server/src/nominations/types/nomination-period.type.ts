/**
 * Represents a nomination period window used by nomination services.
 *
 * - `year`/`month` identify the period
 * - `start` is the inclusive start date of the period
 * - `nextMonthStart` is the start of the following period (exclusive end)
 */
export type NominationPeriod = {
  year: number;
  month: number;
  start: Date;
  nextMonthStart: Date;
};
