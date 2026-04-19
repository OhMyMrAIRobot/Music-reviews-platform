import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthorConfirmationAPI } from '../../api/author/author-confirmation-api';
import { authorConfirmationsKeys } from '../../query-keys/authors-confirmations-keys';
import { CreateAuthorConfirmationData } from '../../types/author';
import { UseMutationParams } from '../../types/common';
import { useApiErrorHandler } from '../use-api-error-handler';
import { useStore } from '../use-store';

/**
 * Custom React hook returning a React Query mutation to send a author confirmation request.
 * On success the hook shows a success notification and invalidates related queries.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for sending author confirmation request.
 */
export const useSendAuthorConfirmation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();
  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: authorConfirmationsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (payload: CreateAuthorConfirmationData) =>
      AuthorConfirmationAPI.create(payload),
    onSuccess: async () => {
      notificationStore.addSuccessNotification(
        t('mutations.authorConfirmationRequest.submitSuccess')
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (err: unknown) => {
      handleApiError(err, t('mutations.authorConfirmationRequest.submitError'));
      onError?.(err);
    },
    onSettled,
  });

  return mutation;
};
