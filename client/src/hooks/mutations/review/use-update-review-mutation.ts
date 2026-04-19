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
import { UpdateReviewData } from '../../../types/review';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useStore } from '../../use-store';

/**
 * Custom React hook returning a React Query mutation to remove an existing review.
 * On success the hook shows a success notification and invalidates
 * related queries so the UI reflects the removed review.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing review.
 */
export const useUpdateReviewMutation = ({
  onSuccess,
  onError,
  onSettled,
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
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      ReviewAPI.update(id, data),
    onSuccess: (data) => {
      notificationStore.addSuccessNotification(
        data.text
          ? t('mutations.userReview.updateSuccessReview')
          : t('mutations.userReview.updateSuccessRating')
      );
      invalidateRelatedQueries(data.release.id);
      onSuccess?.();
    },
    onError: (error: unknown, data) => {
      handleApiError(
        error,
        data.data.text
          ? t('mutations.userReview.updateErrorReview')
          : t('mutations.userReview.updateErrorRating')
      );
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
