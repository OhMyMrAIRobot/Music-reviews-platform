import { useEffect } from 'react'
import { Routes } from 'react-router'
import Loader from './components/loader/loader'
import NotificationContainer from './components/notifications/NotificationContainer'
import { useLoading } from './hooks/use-loading'
import { useStore } from './hooks/use-store'
import Layout from './Layout'
import GlobalRoutes from './routes/Global-routes'

export function App() {
	const { authStore } = useStore()

	const { execute: checkAuth, isLoading } = useLoading(authStore.chechAuth)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkAuth()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return isLoading ? (
		<div className='min-w-screen min-h-screen flex items-center justify-center'>
			<Loader />
		</div>
	) : (
		<Layout>
			<Routes>{GlobalRoutes()}</Routes>
			<NotificationContainer />
		</Layout>
	)
}
