import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router'
import { useStore } from '../hooks/use-store'
import { ROUTES } from './routes-enum'

const AuthRoute = observer(() => {
	const { authStore } = useStore()

	return authStore.isAuth ? <Outlet /> : <Navigate to={ROUTES.MAIN} replace />
})

export default AuthRoute
