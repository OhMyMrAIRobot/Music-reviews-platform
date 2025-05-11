import { useCallback } from 'react'
import { useStore } from './UseStore'

export const useAuthCheck = () => {
	const { authStore, notificationsStore } = useStore()

	const checkAuth = useCallback((): boolean => {
		if (!authStore.isAuth) {
			notificationsStore.addNoAuthNotification(
				'Для выполнения этого действия требуется авторизация!'
			)
			return false
		}

		if (!authStore.user?.isActive) {
			notificationsStore.addNoAuthNotification(
				'Для выполнения этого действия требуется активировать аккаунт!'
			)
			return false
		}

		return true
	}, [authStore.isAuth, authStore.user?.isActive, notificationsStore])

	return { checkAuth }
}
