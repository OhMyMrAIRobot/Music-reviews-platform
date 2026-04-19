import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthAPI } from '../../../api/auth-api';
import { authKeys } from '../../../query-keys/auth-keys';
import authStore from '../../../stores/auth-store';
import { UseMutationParams } from '../../../types/common';
import { generateUUID } from '../../../utils/generate-uuid';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useStore } from '../../use-store';

/**
 * Custom React hook that returns a React Query mutation used to log the current user out. The mutation calls `AuthAPI.logout` and on success it:
 *  - clears local authorization state via `authStore.unsetAuthorization()`;
 *  - shows a success notification;
 *  - invalidates the auth query cache.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for performing the logout.
 */
export const useLogoutMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      authStore.unsetAuthorization();

      notificationStore.addNotification({
        id: generateUUID(),
        text: t('mutations.auth.logoutSuccess'),
        isError: false,
      });

      queryClient.invalidateQueries({ queryKey: authKeys.auth });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('mutations.auth.logoutError'));
      onError?.(error);
    },
    onSettled,
  });

  return {
    ...mutation,
  };
};
