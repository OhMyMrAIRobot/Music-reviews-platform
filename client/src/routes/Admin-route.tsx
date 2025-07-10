import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router'
import { useStore } from '../hooks/use-store'
import { RolesEnum } from '../models/role/roles-enum'
import AdminDashboardPage from '../pages/admin-dashboard-page/Admin-dashboard-page'
import { ROUTES } from './routes-enum'

const AdminRoute = observer(() => {
	const { authStore } = useStore()

	const role = authStore.user?.role.role

	return role === RolesEnum.ADMIN || role === RolesEnum.ROOT_ADMIN ? (
		<>
			<AdminDashboardPage />
		</>
	) : (
		<Navigate to={ROUTES.MAIN} replace />
	)
})

export default AdminRoute
