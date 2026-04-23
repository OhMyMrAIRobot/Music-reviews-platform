import { PrismaClient } from '@prisma/client';
import {
  cleanupAlbumValueVotesE2e,
  seedAlbumValueVotesE2e,
} from './album-value-votes-e2e.fixture';

export async function seedAlbumValuesE2e(prisma: PrismaClient) {
  const base = await seedAlbumValueVotesE2e(prisma);
  await prisma.albumValueVote.create({
    data: {
      userId: base.regular.id,
      releaseId: base.release.id,
      rarityGenre: 0.5,
      rarityPerformance: 1.5,
      formatReleaseScore: 1,
      integrityGenre: 2.5,
      integritySemantic: 0.5,
      depthScore: 3,
      qualityRhymesImages: 5,
      qualityStructureRhythm: 5,
      qualityStyleImpl: 5,
      qualityIndividuality: 5,
      influenceAuthorPopularity: 1.5,
      influenceReleaseAnticip: 2.5,
    },
  });
  return base;
}

export const cleanupAlbumValuesE2e = cleanupAlbumValueVotesE2e;
