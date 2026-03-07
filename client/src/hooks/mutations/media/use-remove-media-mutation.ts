import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReleaseMediaAPI } from "../../../api/release/release-media-api";
import { leaderboardKeys } from "../../../query-keys/leaderboard-keys";
import { platformStatsKeys } from "../../../query-keys/platform-stats-keys";
import { profilesKeys } from "../../../query-keys/profiles-keys";
import { releaseMediaKeys } from "../../../query-keys/release-media-keys";
import { UseMutationParams } from "../../../types/common";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation to remove a media review.
 * On success the hook shows a success notification and invalidates
 * related queries so the UI reflects the removed media review.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing media review.
 */
export const useRemoveMediaMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore, authStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releaseMediaKeys.all },
      { queryKey: profilesKeys.profile(authStore.user?.id || "unknown") },
      { queryKey: platformStatsKeys.all },
      { queryKey: leaderboardKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (id: string) => ReleaseMediaAPI.delete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        "Медиарецензия успешно удалена!",
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось удалить медиарецензию.");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
