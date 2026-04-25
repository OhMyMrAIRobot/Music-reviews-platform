import { PrismaClient } from '@prisma/client';
import { cleanupAuthorsE2e, seedAuthorsE2e } from './authors-e2e.fixture';

export async function seedReleasesE2e(prisma: PrismaClient) {
  const authors = await seedAuthorsE2e(prisma);
  const releaseType = await prisma.releaseType.findFirst();
  if (!releaseType) {
    throw new Error(
      'ReleaseType rows must exist in the database (run seed or migrations).',
    );
  }
  const title = `e2e-rel-${authors.suffix}`.slice(0, 50);
  const release = await prisma.release.create({
    data: {
      title,
      publishDate: new Date('2019-06-15T12:00:00.000Z'),
      releaseTypeId: releaseType.id,
      releaseArtist: {
        create: [{ author: { connect: { id: authors.author.id } } }],
      },
    },
  });
  return {
    ...authors,
    release,
    releaseTypeId: releaseType.id,
  };
}

export async function cleanupReleasesE2e(
  prisma: PrismaClient,
  releaseId: string,
  authorId: string,
  userIds: string[],
) {
  await prisma.release.deleteMany({ where: { id: releaseId } });
  await cleanupAuthorsE2e(prisma, authorId, userIds);
}
