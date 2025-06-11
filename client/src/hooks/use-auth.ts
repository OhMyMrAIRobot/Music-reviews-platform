import { useCallback } from 'react'
import { useStore } from './use-store'

export const useAuth = () => {
	const { authStore, notificationsStore } = useStore()

	const checkAuth = useCallback((): boolean => {
		if (!authStore.isAuth) {
			notificationsStore.addErrorNotification(
				'Для выполнения этого действия требуется авторизация!'
			)
			return false
		}

		if (!authStore.user?.isActive) {
			notificationsStore.addErrorNotification(
				'Для выполнения этого действия требуется активировать аккаунт!'
			)
			return false
		}

		return true
	}, [authStore.isAuth, authStore.user?.isActive, notificationsStore])

	return { checkAuth }
}
