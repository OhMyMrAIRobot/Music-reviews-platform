import { useNavigate } from 'react-router'
import { SearchTypesEnum } from '../models/search/search-types-enum'
import { ROUTES } from '../routes/routes-enum'

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

	const navigateToActivation = () => {
		navigate('/auth/activate')
	}

	const navigateToSearch = (type: SearchTypesEnum, query: string) => {
		navigate(`/search/${type}?query=${encodeURIComponent(query)}`)
	}

	const navigatoToProfile = (id: string) => {
		navigate(`/profile/${id}`)
	}

	const navigateToEditProfile = (id: string) => {
		navigate(`/profile/edit/${id}`)
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
		navigateToSearch,
		navigatoToProfile,
		navigateToEditProfile,
		navigateToActivation,
	}
}

export default useCustomNavigate
