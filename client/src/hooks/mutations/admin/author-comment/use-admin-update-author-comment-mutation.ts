import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthorCommentAPI } from '../../../../api/author/author-comment-api';
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys';
import { UpdateAuthorCommentData } from '../../../../types/author';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';

export const useAdminUpdateAuthorCommentMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: authorCommentsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuthorCommentData }) =>
      AuthorCommentAPI.adminUpdate(id, data),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('admin.authorComment.updateSuccess')
      );
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.authorComment.updateError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
