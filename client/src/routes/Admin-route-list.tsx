import { Route } from 'react-router'
import AdminDashboardUsersGrid from '../pages/admin-dashboard-page/grids/Admin-dashboard-users/Admin-dashboard-users-grid'
import { ROUTES } from './routes-enum'

const AdminRouteList = () => {
	return (
		<>
			<Route path={ROUTES.ADMIN.USERS} element={<AdminDashboardUsersGrid />} />,
			<Route path={ROUTES.ADMIN.NOT_DEFINED} element={<>not defined</>} />,
		</>
	)
}

export default AdminRouteList
