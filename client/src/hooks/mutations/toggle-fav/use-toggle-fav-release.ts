import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UserFavReleaseAPI } from "../../../api/release/user-fav-release-api";
import { leaderboardKeys } from "../../../query-keys/leaderboard-keys";
import { profilesKeys } from "../../../query-keys/profiles-keys";
import { releasesKeys } from "../../../query-keys/releases-keys";
import { UseToggleFavResult } from "../../../types/common";
import { Release } from "../../../types/release";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useAuth } from "../../use-auth";
import { useStore } from "../../use-store";

/**
 * Custom hook to toggle favorite release
 *
 * @param {Release | undefined} release - The release to be toggled.
 * @param {boolean} isFav - Current favorite status of the release.
 * @returns {UseToggleFavResult} An object containing the toggleFav function and toggling state.
 */
export const useToogleFavRelease = (
  release: Release | undefined,
  isFav: boolean,
): UseToggleFavResult => {
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
      { queryKey: profilesKeys.profile(authStore.user?.id ?? "unknown") },
      { queryKey: profilesKeys.preferences(authStore.user?.id ?? "unknown") },
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
          ? "Релиз успешно удален из понравившихся!"
          : "Релиз успешно добавлен в понравившиеся!",
      );
      invalidateRelatedQueries();
    },
    onError: (error: unknown) => {
      handleApiError(
        error,
        isFav
          ? "Не удалось убрать релиз из понравившихся!"
          : "Не удалось добавить релиз в понравившиеся!",
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
