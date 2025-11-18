import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { AuthAPI } from './api/auth-api'
import { ProfileAPI } from './api/user/profile-api'
import Layout from './components/layout/Layout'
import NotificationsContainer from './components/notifications/Notifications-container'
import Loader from './components/utils/Loader'
import { useStore } from './hooks/use-store'
import AuthPage from './pages/auth-page/Auth-page'
import ActivationForm from './pages/auth-page/ui/forms/Activation-form'
import { authKeys } from './query-keys/auth-keys'
import { profileKeys } from './query-keys/profile-keys'
import AdminRoute from './routes/Admin-route'
import AdminRouteList from './routes/Admin-route-list'
import AuthRoute from './routes/Auth-route'
import AuthRouteList from './routes/Auth-route-list'
import GlobalRouteList from './routes/Global-route-list'
import NonAuthRoute from './routes/Non-auth-route'
import NonAuthRouteList from './routes/Non-auth-route-list'
import { ROUTES } from './routes/routes-enum'

export const App = observer(() => {
	const { authStore } = useStore()

	const { data, error, isFetching } = useQuery({
		queryKey: authKeys.auth,
		queryFn: AuthAPI.checkAuth,
		enabled: !!localStorage.getItem('token') && !authStore.isAuth,
		staleTime: Infinity,
	})

	const userId = authStore.user?.id

	const { data: profileData } = useQuery({
		queryKey: userId ? profileKeys.profile(userId) : ['profile', 'null'],
		queryFn: userId
			? () => ProfileAPI.fetchProfile(userId)
			: () => Promise.resolve(null),
		enabled: authStore.isAuth && !!userId && !authStore.profile,
		staleTime: Infinity,
	})

	useEffect(() => {
		if (data) {
			authStore.setAuthorization(data.user, data.accessToken)
		} else if (error) {
			authStore.setAuth(false)
		}
	}, [data, error, authStore])

	useEffect(() => {
		if (profileData) {
			authStore.setProfile(profileData)
			authStore.setProfileLoading(false)
		}
	}, [profileData, authStore])

	const { pathname } = useLocation()

	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return isFetching ? (
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
})
