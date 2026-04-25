import { PrismaClient } from '@prisma/client';
import { AuthorConfirmationStatusesEnum } from '../../src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { cleanupAuthorsE2e, seedAuthorsE2e } from './authors-e2e.fixture';

export async function seedAuthorConfirmationsE2e(prisma: PrismaClient) {
  const base = await seedAuthorsE2e(prisma);
  const pending = await prisma.authorConfirmationStatus.findFirst({
    where: { status: AuthorConfirmationStatusesEnum.PENDING },
  });
  const approved = await prisma.authorConfirmationStatus.findFirst({
    where: { status: AuthorConfirmationStatusesEnum.APPROVED },
  });
  if (!pending || !approved) {
    throw new Error(
      'Author confirmation statuses PENDING and APPROVED must exist (seed database).',
    );
  }
  return { ...base, approvedStatusId: approved.id };
}

export async function cleanupAuthorConfirmationsE2e(
  prisma: PrismaClient,
  authorId: string,
  userIds: string[],
) {
  await prisma.authorConfirmation.deleteMany({
    where: { OR: [{ userId: { in: userIds } }, { authorId }] },
  });
  await cleanupAuthorsE2e(prisma, authorId, userIds);
}
