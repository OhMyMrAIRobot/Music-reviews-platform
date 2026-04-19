import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FeedbackAPI } from '../../api/feedback/feedback-api';
import { feedbackKeys } from '../../query-keys/feedback-keys';
import { UseMutationParams } from '../../types/common';
import { CreateFeedbackData } from '../../types/feedback';
import { useApiErrorHandler } from '../use-api-error-handler';
import { useStore } from '../use-store';

/**
 * Custom React hook returning a React Query mutation to send a feedback.
 * On success the hook shows a success notification and invalidates related queries.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for sending feedback.
 */
export const useSendFeedbackMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateFeedbackData) => FeedbackAPI.create(payload),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('mutations.feedback.sendSuccess')
      );
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('mutations.feedback.sendError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
