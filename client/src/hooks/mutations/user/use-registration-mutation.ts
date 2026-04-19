import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthAPI } from '../../../api/auth-api';
import { RegisterData } from '../../../types/auth';
import { UseMutationParams } from '../../../types/common';
import { useApiErrorHandler } from '../../use-api-error-handler';
import { useStore } from '../../use-store';

/**
 * Custom React hook returning a React Query mutation that registers a new
 * user. The mutation calls `AuthAPI.register` with the provided data.
 * On success it:
 * - sets authorization;
 * - shows a success notification;
 * — if the server indicates an activation email was sent — shows an email-sent
 * notification.
 *
 * @param {UseMutationParams} options - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 *
 * @returns The React Query mutation object for user registration.
 */
export const useRegistrationMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { t } = useTranslation();
  const { authStore, notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: (data: RegisterData) => AuthAPI.register(data),
    onSuccess: (data) => {
      const { user, accessToken, emailSent } = data;
      authStore.setAuthorization(user, accessToken);
      notificationStore.addSuccessNotification(
        t('mutations.auth.registerSuccess')
      );
      if (emailSent) {
        notificationStore.addEmailSentNotification(emailSent);
      }
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, t('mutations.auth.registerError'));
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
