/**
 * Rounds a number to two decimal places
 *
 * @param {number} value - The number to round
 * @returns {number} The rounded number
 */
export const round2 = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
