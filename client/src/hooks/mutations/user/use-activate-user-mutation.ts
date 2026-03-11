import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AuthAPI } from '../../../api/auth-api';
import { UseMutationParams } from '../../../types/common';
import { useApiErrorHandler } from '../../use-api-error-handler';
import useNavigationPath from '../../use-navigation-path';
import { useStore } from '../../use-store';

/**
 * Custom React hook returning a React Query mutation used to activate a
 * user account by token. The mutation calls `AuthAPI.activate(token)` and
 * On success it:
 *  - sets authorization via `authStore.setAuthorization(user, accessToken)`;
 *  - shows a success notification;
 *  - navigates to the main application route.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for performing account activation.
 */
export const useActivateUserMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore, authStore } = useStore();
  const navigate = useNavigate();
  const { navigateToMain } = useNavigationPath();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: (token: string) => AuthAPI.activate(token),
    onSuccess: (data) => {
      const { user, accessToken } = data;
      authStore.setAuthorization(user, accessToken);
      notificationStore.addSuccessNotification('Аккаунт успешно активирован!');
      navigate(navigateToMain);

      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Ошибка при активации аккаунта!');
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
