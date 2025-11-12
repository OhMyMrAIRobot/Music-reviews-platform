import AdminDashboardAuthorCommentsStore from '../pages/admin-dashboard-page/store/admin-dashboard-author-comments-store'
import AdminDashboardAuthorConfirmationStore from '../pages/admin-dashboard-page/store/admin-dashboard-author-confirmation-store'
import AdminDashboardAuthorsStore from '../pages/admin-dashboard-page/store/admin-dashboard-authors-store'
import AdminDashboardFeedbackStore from '../pages/admin-dashboard-page/store/admin-dashboard-feedback-store'
import AdminDashboardMediaStore from '../pages/admin-dashboard-page/store/admin-dashboard-media-store'
import AdminDashboardReleasesStore from '../pages/admin-dashboard-page/store/admin-dashboard-releases-store'
import AdminDashboardReviewsStore from '../pages/admin-dashboard-page/store/admin-dashboard-reviews-store'
import AdminDashboardUsersStore from '../pages/admin-dashboard-page/store/admin-dashboard-users-store'
import AuthorDetailsPageStore from '../pages/author-details-page/store/author-details-page-store'
import AuthStore from './auth-store'
import MetaStore from './meta-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'

class Store {
	metaStore = MetaStore
	authStore = AuthStore
	profileStore = ProfileStore
	notificationStore = NotificationStore
	authorDetailsPageStore = AuthorDetailsPageStore
	adminDashboardUsersStore = AdminDashboardUsersStore
	adminDashboardAuthorsStore = AdminDashboardAuthorsStore
	adminDashboardReleasesStore = AdminDashboardReleasesStore
	adminDashboardReviewsStore = AdminDashboardReviewsStore
	adminDashboardFeedbackStore = AdminDashboardFeedbackStore
	adminDashboardMediaStore = AdminDashboardMediaStore
	adminDashboardAuthorCommentsStore = AdminDashboardAuthorCommentsStore
	adminDashboardAuthorConfirmationStore = AdminDashboardAuthorConfirmationStore
}

export default Store
