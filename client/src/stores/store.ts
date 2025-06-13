import AuthorsPageStore from '../pages/authors-page/store/authors-page-store'
import mainPageStore from '../pages/main-page/store/main-page-store'
import ReleasesPageStore from '../pages/releases-page/store/releases-page-store'
import ReviewsPageStore from '../pages/reviews-page/store/reviews-page-store'
import AuthStore from './auth-store'
import AuthorPageStore from './author-page-store'
import LeaderboardStore from './leaderboard-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'
import ReleasePageStore from './release-page-store'
import ReleaseRatingsPageStore from './release-ratings-page-store'
import SearchStore from './search-store'

class Store {
	authStore = AuthStore
	mainPageStore = mainPageStore
	notificationStore = NotificationStore
	releasesPageStore = ReleasesPageStore
	reviewsPageStore = ReviewsPageStore
	releasePageStore = ReleasePageStore
	authorsPageStore = AuthorsPageStore
	authorPageStore = AuthorPageStore
	leaderboardStore = LeaderboardStore
	releaseRatingsPageStore = ReleaseRatingsPageStore
	searchStore = SearchStore
	profileStore = ProfileStore
}

export default Store
