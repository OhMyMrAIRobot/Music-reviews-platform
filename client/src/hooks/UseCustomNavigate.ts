import { useNavigate } from 'react-router'
import { ROUTES } from '../routes/Routes'

const useCustomNavigate = () => {
	const navigate = useNavigate()

	const navigateToLogin = () => {
		navigate('/auth/login')
	}

	const navigateToRegistration = () => {
		navigate('/auth/register')
	}

	const navigateToRequestReset = () => {
		navigate('/auth/request-reset')
	}

	const navigateToMain = () => {
		navigate('/')
	}

	const navigateToFeedback = () => {
		navigate(ROUTES.FEEDBACK)
	}

	const navigateToRelease = (id: string) => {
		navigate(`/release/${id}`)
	}

	const navigateToAuthors = () => {
		navigate(ROUTES.AUTHORS)
	}

	const navigateToReviews = () => {
		navigate(ROUTES.REVIEWS)
	}

	const navigateToReleases = () => {
		navigate(ROUTES.RELEASES)
	}

	const navigateToAuthor = (id: string) => {
		navigate(`/author/${id}`)
	}

	const navigateToLeaderboard = () => {
		navigate(ROUTES.LEADERBOARD)
	}

	const navigateToRatings = () => {
		navigate(ROUTES.RATINGS)
	}

	return {
		navigateToLogin,
		navigateToRegistration,
		navigateToRequestReset,
		navigateToMain,
		navigateToFeedback,
		navigateToRelease,
		navigateToAuthors,
		navigateToReviews,
		navigateToReleases,
		navigateToAuthor,
		navigateToLeaderboard,
		navigateToRatings,
	}
}

export default useCustomNavigate
