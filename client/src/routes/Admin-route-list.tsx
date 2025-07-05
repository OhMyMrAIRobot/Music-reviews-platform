import { Route } from 'react-router'
import AdminPanelUsersGrid from '../pages/admin-panel-page/grids/Admin-panel-users/Admin-panel-users-grid'
import { ROUTES } from './routes-enum'

const AdminRouteList = () => {
	return (
		<>
			<Route path={ROUTES.ADMIN.USERS} element={<AdminPanelUsersGrid />} />,
			<Route path={ROUTES.ADMIN.NOT_DEFINED} element={<>not defined</>} />,
		</>
	)
}

export default AdminRouteList
