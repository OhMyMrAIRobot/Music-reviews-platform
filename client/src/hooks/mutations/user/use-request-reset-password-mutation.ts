import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../../api/auth-api";
import {
  AuthEmailSentStatusResponse,
  SendResetPasswordData,
} from "../../../types/auth";
import { UseMutationParams } from "../../../types/common";
import { generateUUID } from "../../../utils/generate-uuid";
import { useApiErrorHandler } from "../../use-api-error-handler";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation that requests a password
 * reset email be sent. The mutation calls `AuthAPI.sendResetPassword` with the
 * provided data and the hook displays a notification indicating whether the
 * email was sent successfully.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 *
 * @returns {ReturnType<typeof import('@tanstack/react-query').useMutation>}
 *   The React Query mutation object for requesting password reset.
 */
export const useRequestResetPasswordMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore } = useStore();
  const handleApiError = useApiErrorHandler();

  const mutation = useMutation({
    mutationFn: (data: SendResetPasswordData) =>
      AuthAPI.sendResetPassword(data),
    onSuccess: (data) => {
      handleResponse(data);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(
        error,
        "Ошибка при отправке письма для восстановления пароля!",
      );
      onError?.(error);
    },
    onSettled,
  });

  const handleResponse = (data: AuthEmailSentStatusResponse) => {
    if (data.emailSent) {
      notificationStore.addNotification({
        id: generateUUID(),
        text: "Письмо с инструкциями по восстановлению пароля отправлено на вашу почту!",
        isError: false,
      });
    } else {
      notificationStore.addNotification({
        id: generateUUID(),
        text: "Ошибка при отправке письма для восстановления пароля. Повторите попытку позже!",
        isError: true,
      });
    }
  };

  return mutation;
};
