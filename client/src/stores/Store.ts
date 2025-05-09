import AuthorPageStore from './AuthorPageStore'
import AuthorsStore from './AuthorsStore'
import AuthStore from './AuthStore'
import LeaderboardStore from './LeaderboardStore'
import NotificationsStore from './NotificationsStore'
import ReleasePageStore from './ReleasePageStore'
import ReleaseRatingsPageStore from './ReleaseRatingsPageStore'
import ReleasesStore from './ReleasesStore'
import ReviewsStore from './ReviewsStore'

class Store {
	authStore = AuthStore
	notificationsStore = NotificationsStore
	releasesStore = ReleasesStore
	reviewsStore = ReviewsStore
	releasePageStore = ReleasePageStore
	authorsStore = AuthorsStore
	authorPageStore = AuthorPageStore
	leaderboardStore = LeaderboardStore
	releaseRatingsPageStore = ReleaseRatingsPageStore
}

export default Store
