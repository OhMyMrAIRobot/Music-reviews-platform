import type { TFunction } from 'i18next';
import { FeedbackStatusesEnum } from '../../types/feedback';

export function translateFeedbackAdminStatus(
  t: TFunction,
  status: FeedbackStatusesEnum | string
): string {
  if (status === FeedbackStatusesEnum.NEW)
    return t('adminDashboard.feedbackStatus.new');
  if (status === FeedbackStatusesEnum.READ)
    return t('adminDashboard.feedbackStatus.read');
  if (status === FeedbackStatusesEnum.ANSWERED)
    return t('adminDashboard.feedbackStatus.answered');
  return t('adminDashboard.common.unknown');
}
