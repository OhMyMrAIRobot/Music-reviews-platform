import { PrismaClient } from '@prisma/client';
import { cleanupUsersE2e, seedUsersE2e } from './users-e2e.fixture';

export async function seedAuthorsE2e(prisma: PrismaClient) {
  const users = await seedUsersE2e(prisma);
  const authorType = await prisma.authorType.findFirst();
  if (!authorType) {
    throw new Error(
      'AuthorType rows must exist in the database (run seed or migrations).',
    );
  }
  const name = `e2e-author-${users.suffix}`.slice(0, 50);
  const author = await prisma.author.create({
    data: {
      name,
      types: {
        create: [{ authorType: { connect: { id: authorType.id } } }],
      },
    },
  });
  return {
    ...users,
    author,
    authorTypeId: authorType.id,
  };
}

export async function cleanupAuthorsE2e(
  prisma: PrismaClient,
  authorId: string,
  userIds: string[],
) {
  await prisma.author.deleteMany({ where: { id: authorId } });
  await cleanupUsersE2e(prisma, userIds);
}
