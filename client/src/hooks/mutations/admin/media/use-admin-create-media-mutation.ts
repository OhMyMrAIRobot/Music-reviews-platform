import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api';
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { UseMutationParams } from '../../../../types/common';
import { AdminCreateReleaseMediaData } from '../../../../types/release';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';
/**
 * Custom React hook that returns a React Query mutation for creating a new
 * release media item. On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client UI state up-to-date.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded
 *   to the underlying `useMutation` hook.
 * @returns The React Query mutation object for creating release media.
 */
export const useAdminCreateMediaMutation = ({
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
      { queryKey: releaseMediaKeys.all },
      { queryKey: platformStatsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (data: AdminCreateReleaseMediaData) =>
      ReleaseMediaAPI.adminCreate(data),
    onSuccess: () => {
      notificationStore.addSuccessNotification(t('admin.media.createSuccess'));
      invalidateRelatedQueries();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.media.createError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
