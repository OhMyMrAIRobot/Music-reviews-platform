import { useStore } from './use-store'

type ApiError = {
	response?: { data?: { message?: string[] | string } }
}

export const useApiErrorHandler = () => {
	const { notificationStore } = useStore()

	return (error: unknown, defaultMessage: string = 'Произошла ошибка!') => {
		const axiosError = error as ApiError
		const messages = axiosError?.response?.data?.message || [defaultMessage]
		const messageArray = Array.isArray(messages) ? messages : [messages]
		messageArray.forEach((msg: string) => {
			notificationStore.addErrorNotification(msg)
		})
	}
}
