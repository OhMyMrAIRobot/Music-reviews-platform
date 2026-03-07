import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileAPI } from "../../../../api/user/profile-api";
import { authorCommentsKeys } from "../../../../query-keys/author-comments-keys";
import { authorLikesKeys } from "../../../../query-keys/author-likes-keys";
import { leaderboardKeys } from "../../../../query-keys/leaderboard-keys";
import { profilesKeys } from "../../../../query-keys/profiles-keys";
import { releaseMediaKeys } from "../../../../query-keys/release-media-keys";
import { reviewsKeys } from "../../../../query-keys/reviews-keys";
import { usersKeys } from "../../../../query-keys/users-keys";
import { UseMutationParams } from "../../../../types/common";
import { UpdateProfileData } from "../../../../types/profile";
import { useApiErrorHandler } from "../../../use-api-error-handler";
import { useStore } from "../../../use-store";

/**
 * Custom React hook returning a React Query mutation for administratively
 * updating a user's profile.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - conditionally invalidates either the broader set of user-related
 *    queries
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for administratively updating a profile.
 */
export const useAdminUpdateProfileMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateUserRelatedQueries = (userId: string) => {
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

  const invalidateProfileRelatedQueries = (userId: string) => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: profilesKeys.profile(userId) },
      { queryKey: usersKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: (data: { id: string; updateData: UpdateProfileData }) =>
      ProfileAPI.adminUpdate(data.id, data.updateData),
    onSuccess: (_, { id, updateData }) => {
      notificationStore.addSuccessNotification("Вы успешно обновили профиль!");
      if (updateData.clearAvatar || updateData.clearCover) {
        invalidateUserRelatedQueries(id);
      } else {
        invalidateProfileRelatedQueries(id);
      }
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Ошибка при обновлении профиля");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
