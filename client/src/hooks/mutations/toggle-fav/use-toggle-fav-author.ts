import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { UserFavAuthorAPI } from '../../../api/author/user-fav-author-api';
import { authorsKeys } from '../../../query-keys/authors-keys';
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys';
import { profilesKeys } from '../../../query-keys/profiles-keys';
import { Author } from '../../../types/author';
import { UseToggleFavResult } from '../../../types/common';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useAuth } from '../../use-auth';
import { useStore } from '../../use-store';

/**
 * Custom hook to toggle favorite author
 *
 * @param {Author | undefined} author - The author to be toggled.
 * @param {boolean} isFav - Current favorite status of the author.
 * @returns {UseToggleFavResult} An object containing the toggleFav function and toggling state.
 */
export const useToggleFavAuthor = (
  author: Author | undefined,
  isFav: boolean
): UseToggleFavResult => {
  const { authStore, notificationStore } = useStore();
  const { checkAuth } = useAuth();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
      { queryKey: profilesKeys.preferences(authStore.user?.id ?? 'unknown') },
      { queryKey: authorsKeys.all },
      { queryKey: leaderboardKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      isFav
        ? UserFavAuthorAPI.deleteFromFav(id)
        : UserFavAuthorAPI.addToFav(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        isFav
          ? 'Автор успешно удален из избранного!'
          : 'Автор успешно добавлен в избранное!'
      );

      invalidateRelatedQueries();
    },
    onError: (error: unknown) => {
      handleApiError(
        error,
        isFav
          ? 'Не удалось убрать автора из избранного!'
          : 'Не удалось добавить автора в избранное!'
      );
    },
  });

  const toggleFav = () => {
    if (!checkAuth() || !author || isPending) return;

    return mutateAsync(author.id);
  };

  return { toggleFav, toggling: isPending };
};
