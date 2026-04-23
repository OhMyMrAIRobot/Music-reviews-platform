import { PrismaClient } from '@prisma/client';
import { ReleaseMediaStatusesEnum } from '../../src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from '../../src/release-media-types/types/release-media-types.enum';
import { cleanupReviewsE2e, seedReviewsE2e } from './reviews-e2e.fixture';

export async function seedUserFavoritesE2e(prisma: PrismaClient) {
  const base = await seedReviewsE2e(prisma);
  await prisma.review.update({
    where: { id: base.review.id },
    data: { title: 'E2E review title', text: 'b'.repeat(200) },
  });

  const mediaReviewType = await prisma.releaseMediaType.findFirst({
    where: { type: ReleaseMediaTypesEnum.MEDIA_REVIEW },
  });
  const approvedStatus = await prisma.releaseMediaStatus.findFirst({
    where: { status: ReleaseMediaStatusesEnum.APPROVED },
  });
  if (!mediaReviewType || !approvedStatus) {
    throw new Error(
      'Release media type MEDIA_REVIEW and status APPROVED must exist in the database.',
    );
  }

  const releaseMedia = await prisma.releaseMedia.create({
    data: {
      title: 'E2E media review',
      url: `https://e2e-uf-${base.suffix}.example/watch`,
      releaseId: base.release.id,
      userId: base.admin.id,
      releaseMediaTypeId: mediaReviewType.id,
      releaseMediaStatusId: approvedStatus.id,
    },
  });

  return { ...base, releaseMediaId: releaseMedia.id };
}

export async function cleanupUserFavoritesE2e(
  prisma: PrismaClient,
  reviewId: string,
  releaseId: string,
  authorId: string,
  userIds: string[],
) {
  await cleanupReviewsE2e(prisma, reviewId, releaseId, authorId, userIds);
}
