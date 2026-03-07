import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedbackAPI } from "../../../../api/feedback/feedback-api";
import { feedbackKeys } from "../../../../query-keys/feedback-keys";
import { UseMutationParams } from "../../../../types/common";
import { useApiErrorHandler } from "../../../use-api-error-handler";
import { useStore } from "../../../use-store";
/**
 * Custom React hook returning a React Query mutation for deleting a feedback
 * message. On success the hook shows a success notification
 * and invalidates the `feedbackKeys.all` query so client state is refreshed.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing feedback.
 */
export const useAdminRemoveFeedbackMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: (id: string) => FeedbackAPI.delete(id),
    onSuccess: () => {
      notificationStore.addSuccessNotification("Сообщение успешно удалено!");
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Не удалось удалить сообщение!");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
