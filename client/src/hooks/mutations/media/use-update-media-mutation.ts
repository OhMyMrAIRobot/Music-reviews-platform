import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../api/release/release-media-api';
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys';
import { platformStatsKeys } from '../../../query-keys/platform-stats-keys';
import { profilesKeys } from '../../../query-keys/profiles-keys';
import { releaseMediaKeys } from '../../../query-keys/release-media-keys';
import { UseMutationParams } from '../../../types/common';
import { UpdateReleaseMediaData } from '../../../types/release';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useStore } from '../../use-store';

/**
 * Custom React hook returning a React Query mutation to update a media review.
 * On success the hook shows a success notification and invalidates
 * related queries so the UI reflects the updated media review.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating media review.
 */
export const useUpdateMediaMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore, authStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releaseMediaKeys.all },
      { queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
      { queryKey: platformStatsKeys.all },
      { queryKey: leaderboardKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (data: { id: string; updateData: UpdateReleaseMediaData }) =>
      ReleaseMediaAPI.update(data.id, data.updateData),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('mutations.mediaReview.updateSuccess')
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('mutations.mediaReview.updateError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
