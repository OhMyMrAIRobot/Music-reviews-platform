import { Route } from 'react-router'
import AdminDashboardAuthorsGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-authors/Admin-dashboard-authors-grid'
import AdminDashboardFeedbackGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-feedback/Admin-dashboard-feedback-grid'
import AdminDashboardMediaGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-media/admin-dashboard-media-grid'
import AdminDashboardReleasesGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-releases/Admin-dashboard-releases-grid'
import AdminDashboardReviewsGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-reviews/Admin-dashboard-reviews-grid'
import AdminDashboardUsersGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-users/Admin-dashboard-users-grid'
import { ROUTES } from './routes-enum'

const AdminRouteList = () => {
	return (
		<>
			<Route path={ROUTES.ADMIN.USERS} element={<AdminDashboardUsersGrid />} />,
			<Route
				path={ROUTES.ADMIN.AUTHORS}
				element={<AdminDashboardAuthorsGrid />}
			/>
			,
			<Route
				path={ROUTES.ADMIN.RELEASES}
				element={<AdminDashboardReleasesGrid />}
			/>
			<Route
				path={ROUTES.ADMIN.REVIEWS}
				element={<AdminDashboardReviewsGrid />}
			/>
			,
			<Route
				path={ROUTES.ADMIN.FEEDBACK}
				element={<AdminDashboardFeedbackGrid />}
			/>
			,
			<Route path={ROUTES.ADMIN.MEDIA} element={<AdminDashboardMediaGrid />} />
			<Route path={ROUTES.ADMIN.NOT_DEFINED} element={<>not defined</>} />,
		</>
	)
}

export default AdminRouteList
