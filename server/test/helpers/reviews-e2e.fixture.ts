import { PrismaClient } from '@prisma/client';
import { cleanupReleasesE2e, seedReleasesE2e } from './releases-e2e.fixture';

function computeReviewTotal(
  rhymes: number,
  structure: number,
  realization: number,
  individuality: number,
  atmosphere: number,
) {
  const baseScore = rhymes + structure + realization + individuality;
  const multipliedBaseScore = baseScore * 1.4;
  const atmosphereMultiplier = 1 + (atmosphere - 1) * 0.06747;
  return Math.round(multipliedBaseScore * atmosphereMultiplier);
}

export async function seedReviewsE2e(prisma: PrismaClient) {
  const base = await seedReleasesE2e(prisma);
  const rhymes = 5;
  const structure = 5;
  const realization = 5;
  const individuality = 5;
  const atmosphere = 5;
  const total = computeReviewTotal(
    rhymes,
    structure,
    realization,
    individuality,
    atmosphere,
  );
  const review = await prisma.review.create({
    data: {
      userId: base.regular.id,
      releaseId: base.release.id,
      rhymes,
      structure,
      realization,
      individuality,
      atmosphere,
      total,
    },
  });
  return { ...base, review };
}

export async function cleanupReviewsE2e(
  prisma: PrismaClient,
  reviewId: string,
  releaseId: string,
  authorId: string,
  userIds: string[],
) {
  await prisma.review.deleteMany({ where: { id: reviewId } });
  await cleanupReleasesE2e(prisma, releaseId, authorId, userIds);
}
