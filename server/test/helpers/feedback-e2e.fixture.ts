import { PrismaClient } from '@prisma/client';
import { FeedbackStatusesEnum } from '../../src/feedback-statuses/types/feedback-statuses.enum';
import { cleanupUsersE2e, seedUsersE2e } from './users-e2e.fixture';

export async function seedFeedbackE2e(prisma: PrismaClient) {
  const base = await seedUsersE2e(prisma);

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
