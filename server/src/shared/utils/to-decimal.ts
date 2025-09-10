import { Prisma } from '@prisma/client';

export const toDecimal = (n: number) => {
  return new Prisma.Decimal(n.toString());
};
