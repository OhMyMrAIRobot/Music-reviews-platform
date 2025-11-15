import AdminDashboardFeedbackStore from '../pages/admin-dashboard-page/store/admin-dashboard-feedback-store'
import AuthStore from './auth-store'
import MetaStore from './meta-store'
import NotificationStore from './notification-store'
import ProfileStore from './profile-store'

class Store {
	metaStore = MetaStore
	authStore = AuthStore
	profileStore = ProfileStore
	notificationStore = NotificationStore
	adminDashboardFeedbackStore = AdminDashboardFeedbackStore
}

export default Store
