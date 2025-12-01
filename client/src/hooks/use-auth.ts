import { useCallback } from 'react'
import { useStore } from './use-store'

/**
 * Custom hook providing authentication utilities.
 * This hook offers a method to check if the user is authenticated and has an active account,
 * displaying appropriate error notifications if checks fail.
 *
 * @returns An object containing:
 * - `checkAuth`: Function to verify user authentication and account activation status.
 */
export const useAuth = () => {
	const { authStore, notificationStore } = useStore()

	/**
	 * Checks if the user is authenticated and has an active account.
	 * If not authenticated, shows an error notification about requiring authorization.
	 * If authenticated but account is not active, shows an error notification about needing to activate the account.
	 *
	 * @returns True if the user is authenticated and has an active account, false otherwise.
	 */
	const checkAuth = useCallback(() => {
		if (!authStore.isAuth) {
			notificationStore.addErrorNotification(
				'Для выполнения этого действия требуется авторизация!'
			)
			return false
		}

		if (!authStore.user?.isActive) {
			notificationStore.addErrorNotification(
				'Для выполнения этого действия требуется активировать аккаунт!'
			)
			return false
		}

		return true
	}, [authStore.isAuth, authStore.user?.isActive, notificationStore])

	return { checkAuth }
}
