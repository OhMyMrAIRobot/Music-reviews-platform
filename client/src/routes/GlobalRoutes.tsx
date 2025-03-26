import { Route } from 'react-router'
import AuthPage from '../pages/AuthPage'
import MainPage from '../pages/MainPage'

const GlobalRoutes = () => {
	return [
		<Route path='/' element={<MainPage />} key='main' />,
		<Route path='/auth/*' element={<AuthPage />} key='auth' />,
	]
}

export default GlobalRoutes
