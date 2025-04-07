import AuthStore from './AuthStore'
import NotificationsStore from './NotificationsStore'
import ReleasesStore from './ReleasesStore'
import ReviewsStore from './ReviewsStore'

class Store {
	authStore = AuthStore
	notificationsStore = NotificationsStore
	releasesStore = ReleasesStore
	reviewsStore = ReviewsStore
}

export default Store
