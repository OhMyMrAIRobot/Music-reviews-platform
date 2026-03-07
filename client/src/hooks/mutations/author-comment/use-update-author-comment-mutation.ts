import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthorCommentAPI } from "../../../api/author/author-comment-api";
import { authorCommentsKeys } from "../../../query-keys/author-comments-keys";
import { leaderboardKeys } from "../../../query-keys/leaderboard-keys";
import { platformStatsKeys } from "../../../query-keys/platform-stats-keys";
import { profilesKeys } from "../../../query-keys/profiles-keys";
import { releasesKeys } from "../../../query-keys/releases-keys";
import { UpdateAuthorCommentData } from "../../../types/author";
import { UseMutationParams } from "../../../types/common";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation to update an existing author comment.
 * On success the hook shows a success notification and invalidates
 * related queries so the UI reflects the updated comment.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating author comments.
 */
export const useUpdateAuthorCommentMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore, authStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: authorCommentsKeys.all },
      { queryKey: leaderboardKeys.all },
      { queryKey: platformStatsKeys.all },
      { queryKey: profilesKeys.profile(authStore.user?.id || "unknown") },
      { queryKey: releasesKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuthorCommentData }) =>
      AuthorCommentAPI.update(id, data),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        "Вы успешно изменили авторский комментарий!",
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError(error: unknown) {
      handleApiError(error, "Не удалось изменить авторский комментарий.");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
