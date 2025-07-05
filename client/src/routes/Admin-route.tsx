import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router'
import { useStore } from '../hooks/use-store'
import AdminPanelPage from '../pages/admin-panel-page/Admin-panel-page'
import { ROUTES } from './routes-enum'

const AdminRoute = observer(() => {
	const { authStore } = useStore()

	// TODO: FIX ROLE
	return authStore.user?.roleId === '3' ? (
		<>
			<AdminPanelPage />
		</>
	) : (
		<Navigate to={ROUTES.MAIN} replace />
	)
})

export default AdminRoute
