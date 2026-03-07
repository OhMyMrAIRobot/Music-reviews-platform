import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AuthAPI } from "../../../api/auth-api";
import { ResetPasswordData } from "../../../types/auth";
import { UseMutationParams } from "../../../types/common";
import { useApiErrorHandler } from "../../use-api-error-handler";
import useNavigationPath from "../../use-navigation-path";
import { useStore } from "../../use-store";

/**
 * Custom React hook returning a React Query mutation used to reset a user's
 * password. The mutation calls `AuthAPI.resetPassword` with a password and
 * token.
 * On success it sets authorization via `authStore.setAuthorization`,
 * shows a success notification and navigates to the main application route.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 *
 * @returns The React Query mutation object for resetting a password.
 */
export const useResetPasswordMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationParams = {}) => {
  const { notificationStore, authStore } = useStore();
  const handleApiError = useApiErrorHandler();
  const navigate = useNavigate();
  const { navigateToMain } = useNavigationPath();

  const mutation = useMutation({
    mutationFn: ({ password, token }: ResetPasswordData) =>
      AuthAPI.resetPassword({ password, token }),
    onSuccess: (data) => {
      const { user, accessToken } = data;
      authStore.setAuthorization(user, accessToken);
      notificationStore.addSuccessNotification(
        "Ваш пароль был успешно сброшен!",
      );
      navigate(navigateToMain);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleApiError(error, "Ошибка при сбросе пароля!");
      onError?.(error);
    },
    onSettled,
  });

  return mutation;
};
