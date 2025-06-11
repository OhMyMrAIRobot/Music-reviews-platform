import AuthStore from './auth-store'
import AuthorPageStore from './AuthorPageStore'
import AuthorsStore from './AuthorsStore'
import LeaderboardStore from './LeaderboardStore'
import NotificationsStore from './NotificationsStore'
import ProfileStore from './ProfileStore'
import ReleasePageStore from './ReleasePageStore'
import ReleaseRatingsPageStore from './ReleaseRatingsPageStore'
import ReleasesStore from './ReleasesStore'
import ReviewsStore from './ReviewsStore'
import SearchStore from './SearchStore'

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
	searchStore = SearchStore
	profileStore = ProfileStore
}

export default Store
