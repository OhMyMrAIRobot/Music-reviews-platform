import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { UserAPI } from '../../../../api/user/user-api';
import { albumValuesKeys } from '../../../../query-keys/album-values-keys';
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys';
import { authorLikesKeys } from '../../../../query-keys/author-likes-keys';
import { authorsKeys } from '../../../../query-keys/authors-keys';
import { leaderboardKeys } from '../../../../query-keys/leaderboard-keys';
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys';
import { profilesKeys } from '../../../../query-keys/profiles-keys';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { releasesKeys } from '../../../../query-keys/releases-keys';
import { reviewsKeys } from '../../../../query-keys/reviews-keys';
import { usersKeys } from '../../../../query-keys/users-keys';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';

/**
 * Custom React hook returning a React Query mutation for deleting a user.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing a user.
 */
export const useAdminRemoveUserMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = (userId: string) => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.profile(userId) },
      { queryKey: leaderboardKeys.all },
      { queryKey: authorCommentsKeys.all },
      { queryKey: authorLikesKeys.all },
      { queryKey: releaseMediaKeys.all },
      { queryKey: albumValuesKeys.all },
      { queryKey: releasesKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: usersKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: authorsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (id: string) => UserAPI.adminDelete(id),
    onSuccess: (_, id) => {
      notificationStore.addSuccessNotification(t('admin.user.removeSuccess'));
      invalidateRelatedQueries(id);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.user.removeError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
