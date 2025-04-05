import AuthStore from './AuthStore'
import NotificationsStore from './NotificationsStore'
import ReleasesStore from './ReleasesStore'

class Store {
	authStore = AuthStore
	notificationsStore = NotificationsStore
	releasesStore = ReleasesStore
}

export default Store
