import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthorConfirmationAPI } from "../../../../api/author/author-confirmation-api";
import { authorCommentsKeys } from "../../../../query-keys/author-comments-keys";
import { authorLikesKeys } from "../../../../query-keys/author-likes-keys";
import { authorConfirmationsKeys } from "../../../../query-keys/authors-confirmations-keys";
import { authorsKeys } from "../../../../query-keys/authors-keys";
import { leaderboardKeys } from "../../../../query-keys/leaderboard-keys";
import { platformStatsKeys } from "../../../../query-keys/platform-stats-keys";
import { profilesKeys } from "../../../../query-keys/profiles-keys";
import { releasesKeys } from "../../../../query-keys/releases-keys";
import { reviewsKeys } from "../../../../query-keys/reviews-keys";
import { UseMutationParams } from "../../../../types/common";
import { useApiErrorHandler } from "../../../use-api-error-handler";
import { useStore } from "../../../use-store";

/**
 * Custom React hook returning a React Query mutation for deleting an author
 * confirmation. When the mutation succeeds it:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates a set of related queries to keep client state in sync.
 *
 * @param {UseMutationParams} options - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing an author confirmation.
 */
export const useAdminRemoveAuthorConfirmationMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: authorConfirmationsKeys.all },
      { queryKey: authorCommentsKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: releasesKeys.all },
      { queryKey: authorsKeys.all },
      { queryKey: leaderboardKeys.all },
      { queryKey: profilesKeys.all },
      { queryKey: authorLikesKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: (id: string) => AuthorConfirmationAPI.delete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        "Вы успешно удалили заявку на верификацию!",
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось удалить заявку на верификацию!");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
