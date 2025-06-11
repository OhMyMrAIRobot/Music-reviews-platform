import { makeAutoObservable } from 'mobx'
import { INotification } from '../model/notification/notification'

class NotificationsStore {
	notifications: INotification[] = []

	constructor() {
		makeAutoObservable(this)
	}

	addNotification(notification: INotification) {
		this.notifications.push(notification)
	}

	removeNotification(id: string) {
		this.notifications = this.notifications.filter(
			notification => notification.id !== id
		)
	}

	addEmailSentNotification(isSent: boolean) {
		this.addNotification({
			id: self.crypto.randomUUID(),
			text: isSent
				? 'Письмо с активацией отправлено на вашу почту!'
				: 'Ошибка при отправке письма с активацией. Повторите попытку позже!',
			isError: !isSent,
		})
	}

	addErrorNotification(text: string) {
		this.addNotification({
			id: self.crypto.randomUUID(),
			text: text,
			isError: true,
		})
	}

	addSuccessNotification(text: string) {
		this.addNotification({
			id: self.crypto.randomUUID(),
			text: text,
			isError: false,
		})
	}
}

export default new NotificationsStore()
