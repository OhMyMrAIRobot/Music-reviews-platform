import { Route } from 'react-router'
import AdminPanelPage from '../pages/admin-panel-page/Admin-panel-page'
import { ROUTES } from './routes-enum'

const AdminRouteList = () => {
	return (
		<>
			<Route path={ROUTES.ADMIN.TEST} element={<AdminPanelPage />} />,
		</>
	)
}

export default AdminRouteList
