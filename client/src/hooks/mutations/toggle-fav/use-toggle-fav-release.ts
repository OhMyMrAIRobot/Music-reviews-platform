import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { UserFavReleaseAPI } from '../../../api/release/user-fav-release-api';
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys';
import { profilesKeys } from '../../../query-keys/profiles-keys';
import { releasesKeys } from '../../../query-keys/releases-keys';
import { UseToggleFavResult } from '../../../types/common';
import { Release } from '../../../types/release';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useAuth } from '../../use-auth';
import { useStore } from '../../use-store';

/**
 * Custom hook to toggle favorite release
 *
 * @param {Release | undefined} release - The release to be toggled.
 * @param {boolean} isFav - Current favorite status of the release.
 * @returns {UseToggleFavResult} An object containing the toggleFav function and toggling state.
 */
export const useToogleFavRelease = (
  release: Release | undefined,
  isFav: boolean
): UseToggleFavResult => {
  const { t } = useTranslation();
  const { authStore, notificationStore } = useStore();
  const { checkAuth } = useAuth();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  /**
   * Function to invalidate related queries after mutations
   */
  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releasesKeys.all },
      { queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
      { queryKey: profilesKeys.preferences(authStore.user?.id ?? 'unknown') },
      { queryKey: leaderboardKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  /**
   * Mutation to toggle favorite release
   */
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (release: Release) =>
      isFav
        ? UserFavReleaseAPI.deleteFromFav(release.id)
        : UserFavReleaseAPI.addToFav(release.id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        isFav
          ? t('mutations.toggleFav.release.removeSuccess')
          : t('mutations.toggleFav.release.addSuccess')
      );
      invalidateRelatedQueries();
    },
    onError: (error: unknown) => {
      handleApiError(
        error,
        isFav
          ? t('mutations.toggleFav.release.removeError')
          : t('mutations.toggleFav.release.addError')
      );
    },
  });

  const toggleFav = () => {
    if (!checkAuth() || !release || isPending) return;

    return mutateAsync(release);
  };

  return {
    toggleFav,
    toggling: isPending,
  };
};
