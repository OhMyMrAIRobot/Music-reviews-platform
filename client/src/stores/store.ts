import mainPageStore from '../pages/main-page/store/main-page-store'
import ReleasesStore from '../pages/releases-page/store/releases-store'
import AuthStore from './auth-store'
import AuthorPageStore from './author-page-store'
import AuthorsStore from './authors-store'
import LeaderboardStore from './leaderboard-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'
import ReleasePageStore from './release-page-store'
import ReleaseRatingsPageStore from './release-ratings-page-store'
import ReviewsStore from './reviews-store'
import SearchStore from './search-store'

class Store {
	authStore = AuthStore
	mainPageStore = mainPageStore
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
