import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AuthorAPI } from '../../../../api/author/author-api';
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
 * Custom React hook that returns a React Query mutation for updating an author's data.
 * On success it:
 *  - shows a success notification;
 *  - invalidates related queries so the client state stays consistent.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating an author.
 */
export const useAdminUpdateAuthorMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: leaderboardKeys.all },
      { queryKey: authorCommentsKeys.all },
      { queryKey: authorLikesKeys.all },
      { queryKey: releaseMediaKeys.all },
      { queryKey: releasesKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: usersKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: authorsKeys.all },
      { queryKey: profilesKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      AuthorAPI.updateAuthor(id, formData),
    onSuccess: () => {
      notificationStore.addSuccessNotification('Автор успешно обновлен!');
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Не удалось обновить автора!');
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
