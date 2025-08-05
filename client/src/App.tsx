import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import NotificationsContainer from './components/notifications/Notifications-container'
import Loader from './components/utils/Loader'
import { useStore } from './hooks/use-store'
import AuthPage from './pages/auth-page/Auth-page'
import ActivationForm from './pages/auth-page/ui/forms/Activation-form'
import AdminRoute from './routes/Admin-route'
import AdminRouteList from './routes/Admin-route-list'
import AuthRoute from './routes/Auth-route'
import AuthRouteList from './routes/Auth-route-list'
import GlobalRouteList from './routes/Global-route-list'
import NonAuthRoute from './routes/Non-auth-route'
import NonAuthRouteList from './routes/Non-auth-route-list'
import { ROUTES } from './routes/routes-enum'

export function App() {
	const { authStore } = useStore()
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			authStore.checkAuth().then(() => setIsLoading(false))
		} else {
			setIsLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return isLoading ? (
		<div className='min-w-screen min-h-screen flex items-center justify-center'>
			<Loader className={'mx-auto size-20 border-white'} />
		</div>
	) : (
		<>
			<Routes>
				<Route element={<Layout />}>
					{/* GLOBAL ROUTES */}
					{GlobalRouteList()}

					{/* ROUTES WITH AUTH LAYOUT */}
					<Route element={<AuthPage />} path={ROUTES.AUTH.PREFIX}>
						<Route element={<NonAuthRoute />}>{NonAuthRouteList()}</Route>
						<Route
							path={ROUTES.AUTH.ACTIVATE_WITH_TOKEN}
							element={<ActivationForm />}
						/>
						<Route path={ROUTES.AUTH.ACTIVATE} element={<ActivationForm />} />
					</Route>

					{/* AUTHORIZED ROUTES */}
					<Route element={<AuthRoute />}>{AuthRouteList()}</Route>
				</Route>

				{/* ADMIN ROUTES */}
				<Route element={<AdminRoute />} path={ROUTES.ADMIN.PREFIX}>
					{AdminRouteList()}
				</Route>
			</Routes>
			<NotificationsContainer />
		</>
	)
}
