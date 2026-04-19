import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../../api/release/release-api';
import { albumValuesKeys } from '../../../../query-keys/album-values-keys';
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys';
import { authorLikesKeys } from '../../../../query-keys/author-likes-keys';
import { authorsKeys } from '../../../../query-keys/authors-keys';
import { leaderboardKeys } from '../../../../query-keys/leaderboard-keys';
import { nominationsKeys } from '../../../../query-keys/nominations-keys';
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys';
import { profilesKeys } from '../../../../query-keys/profiles-keys';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { releasesKeys } from '../../../../query-keys/releases-keys';
import { reviewsKeys } from '../../../../query-keys/reviews-keys';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';

/**
 * Custom React hook returning a React Query mutation for deleting a release.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client state stays consistent.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded
 * @returns The React Query mutation object for removing a release.
 */
export const useAdminRemoveReleaseMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();
  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releasesKeys.all },
      { queryKey: profilesKeys.all },
      { queryKey: authorsKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: leaderboardKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: releaseMediaKeys.all },
      { queryKey: authorLikesKeys.all },
      { queryKey: authorCommentsKeys.all },
      { queryKey: albumValuesKeys.all },
      { queryKey: nominationsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (id: string) => ReleaseAPI.delete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('admin.release.removeSuccess')
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.release.removeError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
