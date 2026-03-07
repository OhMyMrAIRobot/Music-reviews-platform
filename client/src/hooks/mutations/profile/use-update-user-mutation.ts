import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UserAPI } from "../../../api/user/user-api";
import { authorCommentsKeys } from "../../../query-keys/author-comments-keys";
import { authorLikesKeys } from "../../../query-keys/author-likes-keys";
import { leaderboardKeys } from "../../../query-keys/leaderboard-keys";
import { profilesKeys } from "../../../query-keys/profiles-keys";
import { releaseMediaKeys } from "../../../query-keys/release-media-keys";
import { reviewsKeys } from "../../../query-keys/reviews-keys";
import { usersKeys } from "../../../query-keys/users-keys";
import { UseMutationParams } from "../../../types/common";
import { UpdateUserData } from "../../../types/user";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation to update a user's account data.
 * On success the hook updates the authorization in the store, shows a success notification, optionally shows an email-sent notification, and invalidates several related queries.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 *
 * @returns The React Query mutation object for updating a user.
 */
export const useUpdateUserMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { authStore, notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = (userId: string) => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.profile(userId) },
      { queryKey: leaderboardKeys.all },
      { queryKey: authorCommentsKeys.all },
      { queryKey: authorLikesKeys.all },
      { queryKey: releaseMediaKeys.all },
      { queryKey: reviewsKeys.all },
      { queryKey: usersKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (data: UpdateUserData) => UserAPI.update(data),
    onSuccess: (data) => {
      const { user, accessToken, emailSent } = data;

      authStore.setAuthorization(user, accessToken);
      notificationStore.addSuccessNotification(
        "Вы успешно обновили данные об аккаунте!",
      );
      if (emailSent) {
        notificationStore.addEmailSentNotification(emailSent);
      }
      invalidateRelatedQueries(user.id);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Ошибка при обновлении данных аккаунта!");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
