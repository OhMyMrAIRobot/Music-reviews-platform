import { useEffect } from 'react'
import { Routes } from 'react-router'
import Loader from './components/Loader'
import NotificationContainer from './components/notifications/NotificationContainer'
import { useLoading } from './hooks/UseLoading'
import { useStore } from './hooks/UseStore'
import Layout from './Layout'
import GlobalRoutes from './routes/GlobalRoutes'

export function App() {
	const { authStore } = useStore()

	const { execute: checkAuth, isLoading } = useLoading(authStore.chechAuth)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkAuth()
		}
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
