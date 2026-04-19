import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../../api/release/release-api';
import { authorsKeys } from '../../../../query-keys/authors-keys';
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys';
import { releasesKeys } from '../../../../query-keys/releases-keys';
import { UseMutationParams } from '../../../../types/common';
import { useApiErrorHandler } from '../../../use-api-error-handler';
import { useStore } from '../../../use-store';

/**
 * useAdminCreateReleaseMutation
 *
 * Custom React hook that returns a React Query mutation for creating a new
 * release. On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client state stays in sync.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded
 *   to the underlying `useMutation` hook.
 * @returns The React Query mutation object for creating a release.
 */
export const useAdminCreateReleaseMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const invalidateRelatedQueriesCreate = () => {
    const keysToInvalidate: InvalidateQueryFilters[] = [
      { queryKey: releasesKeys.all },
      { queryKey: authorsKeys.all },
      { queryKey: platformStatsKeys.all },
    ];

    keysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
  };
  const mutation = useMutation({
    mutationFn: (formData: FormData) => ReleaseAPI.create(formData),
    onSuccess: () => {
      notificationStore.addSuccessNotification(
        t('admin.release.createSuccess')
      );
      invalidateRelatedQueriesCreate();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('admin.release.createError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
