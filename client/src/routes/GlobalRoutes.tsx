import { Route } from 'react-router'
import AuthorsPage from '../pages/AuthorsPage'
import AuthPage from '../pages/AuthPage'
import FeedbackPage from '../pages/FeedbackPage'
import MainPage from '../pages/MainPage'
import ReleasePage from '../pages/ReleasePage'
import ReviewsPage from '../pages/ReviewsPage'
import { ROUTES } from './Routes'

const GlobalRoutes = () => {
	return [
		<Route path={ROUTES.MAIN} element={<MainPage />} key='main' />,
		<Route path={ROUTES.AUTH.AUTH} element={<AuthPage />} key='auth' />,
		<Route path={ROUTES.RELEASE} element={<ReleasePage />} key='release' />,
		<Route path={ROUTES.AUTHORS} element={<AuthorsPage />} key='authors' />,
		<Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} key='feedback' />,
		<Route path={ROUTES.REVIEWS} element={<ReviewsPage />} key='reviews' />,
	]
}

export default GlobalRoutes
