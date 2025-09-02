import { makeAutoObservable } from 'mobx'
import { INotification } from '../models/notification/notification'
import { generateUUID } from '../utils/generate-uuid'

class NotificationStore {
	notifications: INotification[] = []

	constructor() {
		makeAutoObservable(this)
	}

	startNotificationTimer(id: string) {
		setTimeout(() => {
			this.removeNotification(id)
		}, 5000)
	}

	addNotification(notification: INotification) {
		this.notifications.push(notification)
		this.startNotificationTimer(notification.id)
	}

	removeNotification(id: string) {
		this.notifications = this.notifications.filter(
			notification => notification.id !== id
		)
	}

	addEmailSentNotification(isSent: boolean) {
		this.addNotification({
			id: generateUUID(),
			text: isSent
				? 'Письмо с активацией отправлено на вашу почту!'
				: 'Ошибка при отправке письма с активацией. Повторите попытку позже!',
			isError: !isSent,
		})
	}

	addErrorNotification(text: string) {
		this.addNotification({
			id: generateUUID(),
			text: text,
			isError: true,
		})
	}

	addSuccessNotification(text: string) {
		this.addNotification({
			id: generateUUID(),
			text: text,
			isError: false,
		})
	}
}

export default new NotificationStore()
