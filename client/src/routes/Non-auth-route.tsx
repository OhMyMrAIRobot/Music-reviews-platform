import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router'
import { useStore } from '../hooks/use-store'
import { ROUTES } from './routes-enum'

const NonAuthRoute = observer(() => {
	const { authStore } = useStore()

	return authStore.isAuth ? <Navigate to={ROUTES.MAIN} replace /> : <Outlet />
})

export default NonAuthRoute
