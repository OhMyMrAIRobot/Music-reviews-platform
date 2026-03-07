import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReleaseMediaAPI } from "../../../../api/release/release-media-api";
import { platformStatsKeys } from "../../../../query-keys/platform-stats-keys";
import { releaseMediaKeys } from "../../../../query-keys/release-media-keys";
import { UseMutationParams } from "../../../../types/common";
import { AdminUpdateReleaseMediaData } from "../../../../types/release";
import { useApiErrorHandler } from "../../../use-api-error-handler";
import { useStore } from "../../../use-store";
/**
 * Custom React hook that returns a React Query mutation for updating a
 * release media item. On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client state stays in sync.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to
 *   forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating release media.
 */
export const useAdminUpdateMediaMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releaseMediaKeys.all },
      { queryKey: platformStatsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AdminUpdateReleaseMediaData;
    }) => ReleaseMediaAPI.adminUpdate(id, data),
    onSuccess: () => {
      notificationStore.addSuccessNotification("Медиа успешно обновлено!");
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось обновить медиа!");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
