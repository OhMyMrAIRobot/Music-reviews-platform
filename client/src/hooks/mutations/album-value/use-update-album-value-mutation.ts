import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AlbumValueAPI } from "../../../api/album-value-api";
import { albumValuesKeys } from "../../../query-keys/album-values-keys";
import { leaderboardKeys } from "../../../query-keys/leaderboard-keys";
import { profilesKeys } from "../../../query-keys/profiles-keys";
import { UpdateAlbumValueVoteData } from "../../../types/album-value";
import { UseMutationParams } from "../../../types/common";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation to update an album value vote.
 * On success the hook shows a success notification and invalidates
 * related queries so the UI reflects the updated album value vote.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating album value vote.
 */
export const useUpdateAlbumValueMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore, authStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: albumValuesKeys.all },
      { queryKey: profilesKeys.profile(authStore.user?.id || "unknown") },
      { queryKey: leaderboardKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAlbumValueVoteData;
    }) => AlbumValueAPI.updateAlbumValueVote(id, data),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        "Вы успешно изменили голос за ценность альбома!",
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось изменить голос за ценность альбома.");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
