import { Route } from 'react-router'
import AuthorDetailsPage from '../pages/author-details-page/Author-details-page'
import AuthorsPage from '../pages/authors-page/Authors-page'
import FeedbackPage from '../pages/feedback-page/Feedback-page'
import LeaderboardPage from '../pages/leaderboard-page/Leaderboard-page'
import MainPage from '../pages/main-page/Main-page'
import MediaReviewsPage from '../pages/media-reviews-page/Media-reviews-page'
import ProfilePage from '../pages/profile-page/Profile-page'
import ReleaseDetailsPage from '../pages/release-details-page/Release-details-page'
import ReleasesPage from '../pages/releases-page/Releases-page'
import ReleasesRatingPage from '../pages/releases-rating-page/Releases-rating-page'
import ReviewsPage from '../pages/reviews-page/Reviews-page'
import SearchPage from '../pages/search-page/Search-page'
import { ROUTES } from './routes-enum'

const GlobalRouteList = () => {
	return (
		<>
			<Route path={ROUTES.MAIN} element={<MainPage />} />,
			<Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />,
			<Route path={ROUTES.AUTHORS} element={<AuthorsPage />} />,
			<Route path={ROUTES.REVIEWS} element={<ReviewsPage />} />,
			<Route path={ROUTES.RELEASES} element={<ReleasesPage />} />,
			<Route path={ROUTES.AUTHOR_DETAILS} element={<AuthorDetailsPage />} />,
			<Route path={ROUTES.RELEASE_DETAILS} element={<ReleaseDetailsPage />} />,
			<Route path={ROUTES.SEARCH} element={<SearchPage />} />,
			<Route path={ROUTES.PROFILE} element={<ProfilePage />} />,
			<Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />,
			<Route path={ROUTES.RATINGS} element={<ReleasesRatingPage />} />,
			<Route path={ROUTES.MEDIA_REVIEWS} element={<MediaReviewsPage />} />,
			<Route path={ROUTES.NOT_DEFINED} element={<MainPage />} />,
		</>
	)
}

export default GlobalRouteList
