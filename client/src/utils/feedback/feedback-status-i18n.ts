import type { TFunction } from 'i18next';
import {
  FeedbackStatusesEnum,
  FeedbackStatusesFilterEnum,
} from '../../types/feedback';

export function translateFeedbackStatus(t: TFunction, status: string): string {
  switch (status) {
    case FeedbackStatusesEnum.NEW:
      return t('adminDashboard.feedbackStatus.new');
    case FeedbackStatusesEnum.READ:
      return t('adminDashboard.feedbackStatus.read');
    case FeedbackStatusesEnum.ANSWERED:
      return t('adminDashboard.feedbackStatus.answered');
    default:
      return status;
  }
}

export function translateFeedbackStatusFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === FeedbackStatusesFilterEnum.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateFeedbackStatus(t, option);
}
