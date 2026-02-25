import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../../../api/auth-api'
import { LoginData } from '../../../types/auth'
import { UseMutationParams } from '../../../types/common'
import { useApiErrorHandler } from '../../use-api-error-handler'
import { useStore } from '../../use-store'

/**
 * Custom React hook returning a React Query mutation that performs user login.
 * The mutation calls `AuthAPI.login` with the provided credentials.
 * On success it sets the authorization state via `authStore.setAuthorization`
 * and shows a success notification.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to
 * forward to the underlying `useMutation` hook.
 *
 * @returns The React Query mutation object for performing login.
 */
export const useLoginMutation = ({
	onSuccess,
	onError,
	onSettled,
}: UseMutationParams = {}) => {
	const { authStore, notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()

	const mutation = useMutation({
		mutationFn: ({ email, password }: LoginData) =>
			AuthAPI.login({ email, password }),
		onSuccess: data => {
			const { user, accessToken } = data
			authStore.setAuthorization(user, accessToken)
			notificationStore.addSuccessNotification('Вы успешно вошли!')
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при выполнении входа!')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
