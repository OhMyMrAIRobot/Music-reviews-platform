import AdminDashboardAuthorsStore from '../pages/admin-dashboard-page/store/admin-dashboard-authors-store'
import AdminDashboardFeedbackStore from '../pages/admin-dashboard-page/store/admin-dashboard-feedback-store'
import AdminDashboardMediaStore from '../pages/admin-dashboard-page/store/admin-dashboard-media-store'
import AdminDashboardReleasesStore from '../pages/admin-dashboard-page/store/admin-dashboard-releases-store'
import AdminDashboardReviewsStore from '../pages/admin-dashboard-page/store/admin-dashboard-reviews-store'
import AdminDashboardUsersStore from '../pages/admin-dashboard-page/store/admin-dashboard-users-store'
import AuthorDetailsPageStore from '../pages/author-details-page/store/author-details-page-store'
import AuthorsPageStore from '../pages/authors-page/store/authors-page-store'
import LeaderboardStore from '../pages/leaderboard-page/store/leaderboard-store'
import MainPageStore from '../pages/main-page/store/main-page-store'
import MediaReviewsPageStore from '../pages/media-reviews-page/store/media-reviews-page-store'
import ProfilePageStore from '../pages/profile-page/store/profile-page-store'
import ReleaseDetailsPageStore from '../pages/release-details-page/store/release-details-page-store'
import ReleasesPageStore from '../pages/releases-page/store/releases-page-store'
import ReleasesRatingPageStore from '../pages/releases-rating-page/store/releases-rating-page-store'
import ReviewsPageStore from '../pages/reviews-page/store/reviews-page-store'
import SearchPageStore from '../pages/search-page/store/search-page-store'
import AuthStore from './auth-store'
import MetaStore from './meta-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'

class Store {
	metaStore = MetaStore
	authStore = AuthStore
	profileStore = ProfileStore
	mainPageStore = MainPageStore
	notificationStore = NotificationStore
	releasesPageStore = ReleasesPageStore
	reviewsPageStore = ReviewsPageStore
	releaseDetailsPageStore = ReleaseDetailsPageStore
	authorsPageStore = AuthorsPageStore
	authorDetailsPageStore = AuthorDetailsPageStore
	leaderboardStore = LeaderboardStore
	releasesRatingPageStore = ReleasesRatingPageStore
	searchPageStore = SearchPageStore
	profilePageStore = ProfilePageStore
	mediaReviewPageStore = MediaReviewsPageStore
	adminDashboardUsersStore = AdminDashboardUsersStore
	adminDashboardAuthorsStore = AdminDashboardAuthorsStore
	adminDashboardReleasesStore = AdminDashboardReleasesStore
	adminDashboardReviewsStore = AdminDashboardReviewsStore
	adminDashboardFeedbackStore = AdminDashboardFeedbackStore
	adminDashboardMediaStore = AdminDashboardMediaStore
}

export default Store
