import { useCallback } from 'react'
import { useStore } from './use-store'

export const useAuth = () => {
	const { authStore, notificationStore } = useStore()

	const checkAuth = useCallback((): boolean => {
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
