import type { TFunction } from 'i18next';
import { ReleaseReviewSortFields, ReviewSortFields } from '../../types/review';

export function translateReviewSortField(t: TFunction, option: string): string {
  if (option === ReviewSortFields.NEW || option === ReleaseReviewSortFields.NEW)
    return t('review.sort.new');
  if (option === ReviewSortFields.OLD || option === ReleaseReviewSortFields.OLD)
    return t('review.sort.old');
  if (option === ReleaseReviewSortFields.POPULAR)
    return t('review.sort.popular');
  return option;
}
