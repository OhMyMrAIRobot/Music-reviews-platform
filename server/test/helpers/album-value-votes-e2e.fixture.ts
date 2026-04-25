import { PrismaClient } from '@prisma/client';
import { ReleaseTypesEnum } from '../../src/release-types/types/release-types.enum';
import { cleanupAuthorsE2e, seedAuthorsE2e } from './authors-e2e.fixture';

export async function seedAlbumValueVotesE2e(prisma: PrismaClient) {
  const base = await seedAuthorsE2e(prisma);
  const albumReleaseType = await prisma.releaseType.findFirst({
    where: { type: ReleaseTypesEnum.ALBUM },
  });
  if (!albumReleaseType) {
    throw new Error(
      'ReleaseType ALBUM must exist in the database (run seed or migrations).',
    );
  }
  const title = `e2e-album-vote-${base.suffix}`.slice(0, 50);
  const release = await prisma.release.create({
    data: {
      title,
      publishDate: new Date('2019-01-01T12:00:00.000Z'),
      releaseTypeId: albumReleaseType.id,
      releaseArtist: {
        create: [{ author: { connect: { id: base.author.id } } }],
      },
    },
  });
  return { ...base, release };
}

export async function cleanupAlbumValueVotesE2e(
  prisma: PrismaClient,
  releaseId: string,
  authorId: string,
  userIds: string[],
) {
  await prisma.albumValueVote.deleteMany({ where: { releaseId } });
  await prisma.release.deleteMany({ where: { id: releaseId } });
  await cleanupAuthorsE2e(prisma, authorId, userIds);
}
