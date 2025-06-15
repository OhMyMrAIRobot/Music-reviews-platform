import AuthorsPageStore from '../pages/authors-page/store/authors-page-store'
import LeaderboardStore from '../pages/leaderboard-page/store/leaderboard-store'
import mainPageStore from '../pages/main-page/store/main-page-store'
import ReleasesPageStore from '../pages/releases-page/store/releases-page-store'
import ReleasesRatingPageStore from '../pages/releases-rating-page/store/releases-rating-page-store'
import ReviewsPageStore from '../pages/reviews-page/store/reviews-page-store'
import SearchPageStore from '../pages/search-page/store/search-page-store'
import AuthStore from './auth-store'
import AuthorPageStore from './author-page-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'
import ReleasePageStore from './release-page-store'

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
	releasesRatingPageStore = ReleasesRatingPageStore
	searchPageStore = SearchPageStore
	profileStore = ProfileStore
}

export default Store
