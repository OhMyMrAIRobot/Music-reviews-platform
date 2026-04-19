import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from './use-store';

/**
 * Type representing an API error structure, typically from Axios responses.
 */
type ApiError = {
  response?: { data?: { message?: string[] | string } };
};

/**
 * Custom hook providing an API error handler function.
 * This hook returns a function that processes API errors, extracts error messages,
 * and displays them as error notifications to the user.
 *
 * @returns A function that handles API errors by showing notifications.
 */
export const useApiErrorHandler = () => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();

  /**
   * Handles API errors by extracting messages and displaying them as notifications.
   * If the error contains a response with messages, those are used; otherwise, a default message is shown.
   * Supports both single string messages and arrays of messages.
   *
   * @param error - The error object, typically from an API call (e.g., Axios error).
   * @param defaultMessage - The default message to display if no specific error messages are found.
   */
  return useCallback(
    (error: unknown, defaultMessage?: string) => {
      const fallback = defaultMessage ?? t('hooks.apiError.defaultMessage');
      const axiosError = error as ApiError;
      const messages = axiosError?.response?.data?.message || [fallback];
      const messageArray = Array.isArray(messages) ? messages : [messages];
      messageArray.forEach((msg: string) => {
        notificationStore.addErrorNotification(msg);
      });
    },
    [notificationStore, t]
  );
};
