import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReviewAPI } from '../../../api/review/review-api';
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys';
import { platformStatsKeys } from '../../../query-keys/platform-stats-keys';
import { profilesKeys } from '../../../query-keys/profiles-keys';
import { releasesKeys } from '../../../query-keys/releases-keys';
import { reviewsKeys } from '../../../query-keys/reviews-keys';
import { UseMutationParams } from '../../../types/common';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useStore } from '../../use-store';

export const useRemoveReviewMutation = ({
  onSettled,
  onSuccess,
  onError,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { authStore, notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = (releaseId: string) => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releasesKeys.details(releaseId) },
      { queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
      { queryKey: leaderboardKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: releasesKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: ({ id }: { id: string; isReview: boolean }) =>
      ReviewAPI.delete(id),
    onSuccess: (_, data) => {
      notificationStore.addSuccessNotification(
        data.isReview
          ? t('mutations.userReview.removeSuccessReview')
          : t('mutations.userReview.removeSuccessRating')
      );
      invalidateRelatedQueries(data.id);
      onSuccess?.();
    },
    onError: (error: unknown, data) => {
      handleApiError(
        error,
        data.isReview
          ? t('mutations.userReview.removeErrorReview')
          : t('mutations.userReview.removeErrorRating')
      );
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
