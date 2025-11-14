import AdminDashboardAuthorCommentsStore from '../pages/admin-dashboard-page/store/admin-dashboard-author-comments-store'
import AdminDashboardAuthorConfirmationStore from '../pages/admin-dashboard-page/store/admin-dashboard-author-confirmation-store'
import AdminDashboardAuthorsStore from '../pages/admin-dashboard-page/store/admin-dashboard-authors-store'
import AdminDashboardFeedbackStore from '../pages/admin-dashboard-page/store/admin-dashboard-feedback-store'
import AdminDashboardMediaStore from '../pages/admin-dashboard-page/store/admin-dashboard-media-store'
import AdminDashboardReviewsStore from '../pages/admin-dashboard-page/store/admin-dashboard-reviews-store'
import AuthStore from './auth-store'
import MetaStore from './meta-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'

class Store {
	metaStore = MetaStore
	authStore = AuthStore
	profileStore = ProfileStore
	notificationStore = NotificationStore
	adminDashboardAuthorsStore = AdminDashboardAuthorsStore
	adminDashboardReviewsStore = AdminDashboardReviewsStore
	adminDashboardFeedbackStore = AdminDashboardFeedbackStore
	adminDashboardMediaStore = AdminDashboardMediaStore
	adminDashboardAuthorCommentsStore = AdminDashboardAuthorCommentsStore
	adminDashboardAuthorConfirmationStore = AdminDashboardAuthorConfirmationStore
}

export default Store
