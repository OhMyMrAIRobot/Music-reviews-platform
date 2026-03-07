import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReviewAPI } from "../../../../api/review/review-api";
import { authorsKeys } from "../../../../query-keys/authors-keys";
import { leaderboardKeys } from "../../../../query-keys/leaderboard-keys";
import { platformStatsKeys } from "../../../../query-keys/platform-stats-keys";
import { profilesKeys } from "../../../../query-keys/profiles-keys";
import { releaseMediaKeys } from "../../../../query-keys/release-media-keys";
import { releasesKeys } from "../../../../query-keys/releases-keys";
import { reviewsKeys } from "../../../../query-keys/reviews-keys";
import { usersKeys } from "../../../../query-keys/users-keys";
import { UseMutationParams } from "../../../../types/common";
import { useApiErrorHandler } from "../../../use-api-error-handler";
import { useStore } from "../../../use-store";

/**
 * Custom React hook returning a React Query mutation for deleting a review.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing a review.
 */
export const useAdminRemoveReviewMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.all },
      { queryKey: leaderboardKeys.all },
      { queryKey: releasesKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: usersKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: authorsKeys.all },
      { queryKey: releaseMediaKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: ({ id }: { id: string }) => ReviewAPI.adminDelete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification("Вы успешно удалили рецензию!");
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось удалить рецензию");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
