import AuthStore from './AuthStore'
import NotificationsStore from './NotificationsStore'
import ReleasePageStore from './ReleasePageStore'
import ReleasesStore from './ReleasesStore'
import ReviewsStore from './ReviewsStore'

class Store {
	authStore = AuthStore
	notificationsStore = NotificationsStore
	releasesStore = ReleasesStore
	reviewsStore = ReviewsStore
	releasePageStore = ReleasePageStore
}

export default Store
