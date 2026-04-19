import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FeedbackAPI } from '../../../../api/feedback/feedback-api';
import { feedbackKeys } from '../../../../query-keys/feedback-keys';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';

/**
 * Custom React hook returning a React Query mutation for updating a feedback
 * status.
 * On success the hook shows a success notification and
 * invalidates the `feedbackKeys.all` query so the client state stays up to date.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating feedback.
 */
export const useAdminUpdateFeedbackMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: ({
      feedbackId,
      statusId,
    }: {
      feedbackId: string;
      statusId: string;
    }) => FeedbackAPI.update(feedbackId, { feedbackStatusId: statusId }),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('admin.feedback.updateSuccess')
      );
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.feedback.updateError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
