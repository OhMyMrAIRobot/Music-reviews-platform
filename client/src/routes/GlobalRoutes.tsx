import { Route } from 'react-router'
import AuthPage from '../pages/AuthPage'
import FeedbackPage from '../pages/FeedbackPage'
import MainPage from '../pages/MainPage'

const GlobalRoutes = () => {
	return [
		<Route path='/' element={<MainPage />} key='main' />,
		<Route path='/auth/*' element={<AuthPage />} key='auth' />,
		<Route path='/feedback' element={<FeedbackPage />} key='feedback' />,
	]
}

export default GlobalRoutes
