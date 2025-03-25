import { makeAutoObservable } from 'mobx'
import { INotification } from '../models/Notification'

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
}

export default new NotificationsStore()
