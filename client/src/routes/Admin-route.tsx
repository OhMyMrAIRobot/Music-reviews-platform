import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router'
import { useStore } from '../hooks/use-store'
import { ROUTES } from './routes-enum'

const AdminRoute = observer(() => {
	const { authStore } = useStore()

	// TODO: FIX ROLE
	return authStore.user?.roleId === '2' ? (
		<Outlet />
	) : (
		<Navigate to={ROUTES.MAIN} replace />
	)
})

export default AdminRoute
