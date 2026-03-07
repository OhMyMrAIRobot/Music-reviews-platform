import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../../../api/auth-api'
import { UseMutationParams } from '../../../types/common'
import { useApiErrorHandler } from '../../use-api-error-handler'
import { useStore } from '../../use-store'

/**
 * Custom React hook returning a React Query mutation which requests the
 * server to resend the activation email for the current user.
 * On success the hook will dispatch an email-sent notification if the server indicates the message was sent.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for resending activation email.
 */
export const useResendActivationMutation = ({
	onSuccess,
	onError,
	onSettled,
}: UseMutationParams = {}) => {
	const { notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()

	const mutation = useMutation({
		mutationFn: () => AuthAPI.resendActivation(),
		onSuccess: data => {
			if (data.emailSent) {
				notificationStore.addEmailSentNotification(data.emailSent)
			}
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при отправке письма активации!')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
