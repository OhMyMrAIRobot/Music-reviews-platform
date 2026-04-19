import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api';
import { leaderboardKeys } from '../../../../query-keys/leaderboard-keys';
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys';
import { profilesKeys } from '../../../../query-keys/profiles-keys';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';
/**
 * Custom React hook that returns a React Query mutation to delete a release
 * media item. On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client state stays in sync.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to
 *   forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing release media.
 */
export const useAdminRemoveMediaMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.all },
      { queryKey: releaseMediaKeys.all },
      { queryKey: leaderboardKeys.all },
      { queryKey: platformStatsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: (id: string) => ReleaseMediaAPI.adminDelete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(t('admin.media.removeSuccess'));
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.media.removeError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
