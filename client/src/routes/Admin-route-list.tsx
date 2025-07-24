import { Route } from 'react-router'
import AdminDashboardAuthorsGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-authors/Admin-dashboard-authors-grid'
import AdminDashboardReleasesGrid from '../pages/admin-dashboard-page/ui/grids/admin-dashboard-releases/Admin-dashboard-releases-grid'
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
			,
			<Route path={ROUTES.ADMIN.NOT_DEFINED} element={<>not defined</>} />,
		</>
	)
}

export default AdminRouteList
