import { Route } from 'react-router'
import AuthorPage from '../pages/AuthorPage'
import AuthorsPage from '../pages/AuthorsPage'
import AuthPage from '../pages/AuthPage'
import EditProfilePage from '../pages/EditProfilePage'
import FeedbackPage from '../pages/FeedbackPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import MainPage from '../pages/main-page/Main-page'
import ProfilePage from '../pages/ProfilePage'
import ReleasePage from '../pages/ReleasePage'
import ReleasesPage from '../pages/ReleasesPage'
import ReleasesRatingsPage from '../pages/ReleasesRatingsPage'
import ReviewsPage from '../pages/ReviewsPage'
import SearchPage from '../pages/SearchPage'
import { ROUTES } from './Routes'

const GlobalRoutes = () => {
	return [
		<Route path={ROUTES.MAIN} element={<MainPage />} key='main' />,
		<Route path={ROUTES.AUTH.AUTH} element={<AuthPage />} key='auth' />,
		<Route path={ROUTES.RELEASE} element={<ReleasePage />} key='release' />,
		<Route path={ROUTES.AUTHORS} element={<AuthorsPage />} key='authors' />,
		<Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} key='feedback' />,
		<Route path={ROUTES.REVIEWS} element={<ReviewsPage />} key='reviews' />,
		<Route path={ROUTES.RELEASES} element={<ReleasesPage />} key='releases' />,
		<Route path={ROUTES.AUTHOR} element={<AuthorPage />} key='author' />,
		<Route path={ROUTES.SEARCH} element={<SearchPage />} key='search' />,
		<Route path={ROUTES.PROFILE} element={<ProfilePage />} key='profile' />,
		<Route
			path={ROUTES.EDIT_PROFILE}
			element={<EditProfilePage />}
			key='edit_profile'
		/>,
		<Route
			path={ROUTES.LEADERBOARD}
			element={<LeaderboardPage />}
			key='leaderboard'
		/>,
		<Route
			path={ROUTES.RATINGS}
			element={<ReleasesRatingsPage />}
			key='author'
		/>,
	]
}

export default GlobalRoutes
