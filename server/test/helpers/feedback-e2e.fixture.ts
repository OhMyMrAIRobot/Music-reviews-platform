import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { FeedbackStatusesEnum } from '../../src/feedback-statuses/types/feedback-statuses.enum';
import { UserRoleEnum } from '../../src/roles/types/user-role.enum';
import { cleanupUsersE2e, seedUsersE2e } from './users-e2e.fixture';

export async function seedFeedbackE2e(prisma: PrismaClient) {
  const base = await seedUsersE2e(prisma);
  const rootRole = await prisma.role.findFirst({
    where: { role: UserRoleEnum.ROOT_ADMIN },
  });
  if (!rootRole) {
    throw new Error('ROOT_ADMIN role must exist in the database.');
  }
  const password = await bcrypt.hash('testpass123', 10);
  const rootNick = `e2ert${base.suffix}`.slice(0, 20);
  const root = await prisma.user.create({
    data: {
      email: `e2e-feedback-root-${base.suffix}@test.local`,
      nickname:
        rootNick.length >= 3 ? rootNick : `e2fr${base.suffix}`.slice(0, 20),
      password,
      isActive: true,
      roleId: rootRole.id,
    },
  });
  await prisma.userProfile.create({ data: { userId: root.id } });

  const readStatus = await prisma.feedbackStatus.findFirst({
    where: { status: FeedbackStatusesEnum.READ },
  });
  const answeredStatus = await prisma.feedbackStatus.findFirst({
    where: { status: FeedbackStatusesEnum.ANSWERED },
  });
  if (!readStatus || !answeredStatus) {
    throw new Error('Feedback statuses READ and ANSWERED must exist.');
  }

  return {
    ...base,
    root,
    readStatusId: readStatus.id,
    answeredStatusId: answeredStatus.id,
  };
}

export async function cleanupFeedbackE2e(
  prisma: PrismaClient,
  feedbackIds: string[],
  userIds: string[],
) {
  await prisma.feedback.deleteMany({ where: { id: { in: feedbackIds } } });
  await cleanupUsersE2e(prisma, userIds);
}
