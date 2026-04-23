import { PrismaClient } from '@prisma/client';
import { cleanupReleasesE2e, seedReleasesE2e } from './releases-e2e.fixture';

export async function seedAuthorCommentsE2e(prisma: PrismaClient) {
  const base = await seedReleasesE2e(prisma);
  await prisma.registeredAuthor.create({
    data: { userId: base.regular.id, authorId: base.author.id },
  });
  await prisma.registeredAuthor.create({
    data: { userId: base.admin.id, authorId: base.author.id },
  });
  return base;
}

export async function cleanupAuthorCommentsE2e(
  prisma: PrismaClient,
  releaseId: string,
  authorId: string,
  userIds: string[],
) {
  await cleanupReleasesE2e(prisma, releaseId, authorId, userIds);
}
