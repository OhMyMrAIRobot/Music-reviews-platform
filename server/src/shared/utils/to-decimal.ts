import { Prisma } from '@prisma/client';

/**
 * Converts a JavaScript number to a Prisma Decimal instance.
 *
 * Prisma Decimal provides arbitrary precision decimal arithmetic, which is
 * essential for financial calculations and avoiding floating-point precision
 * issues in database operations.
 *
 * @param n - The number to convert to Decimal
 * @returns A new Prisma.Decimal instance representing the number
 */
export const toDecimal = (n: number): Prisma.Decimal => {
  return new Prisma.Decimal(n.toString());
};
