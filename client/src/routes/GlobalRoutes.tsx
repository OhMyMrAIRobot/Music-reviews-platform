import { Route, Routes } from 'react-router'
import AuthPage from '../pages/AuthPage'
import MainPage from '../pages/MainPage'

const GlobalRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<MainPage />} />
			<Route path='/auth/*' element={<AuthPage />} />
		</Routes>
	)
}

export default GlobalRoutes
