import AuthStore from './auth-store'
import AuthorPageStore from './author-page-store'
import AuthorsStore from './authors-store'
import LeaderboardStore from './leaderboard-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'
import ReleasePageStore from './release-page-store'
import ReleaseRatingsPageStore from './release-ratings-page-store'
import ReleasesStore from './releases-store'
import ReviewsStore from './reviews-store'
import SearchStore from './search-store'

class Store {
	authStore = AuthStore
	notificationStore = NotificationStore
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
