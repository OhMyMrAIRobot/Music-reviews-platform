import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FeedbackReplyAPI } from '../../../../api/feedback/feedback-reply-api';
import { feedbackKeys } from '../../../../query-keys/feedback-keys';
import { UseMutationParams } from '../../../../types/common';
import { CreateFeedbackReplyData } from '../../../../types/feedback';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';
/**
 * Custom React hook returning a React Query mutation for creating a reply to
 * a user feedback.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates the `feedbackKeys.all` query so the feedback list is refreshed.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for creating feedback replies.
 */
export const useAdminCreateFeedbackReplyMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: (replyData: CreateFeedbackReplyData) =>
      FeedbackReplyAPI.create(replyData),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('admin.feedback.replySuccess')
      );
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.feedback.replyError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
