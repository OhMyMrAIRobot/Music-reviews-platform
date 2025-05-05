import { useNavigate } from 'react-router'

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
		navigate('/feedback')
	}

	const navigateToRelease = (id: string) => {
		navigate(`/release/${id}`)
	}

	const navigateToAuthors = () => {
		navigate(`/authors`)
	}

	const navigateToReviews = () => {
		navigate(`/reviews`)
	}

	const navigateToReleases = () => {
		navigate(`/releases`)
	}

	const navigateToAuthor = (id: string) => {
		navigate(`/author/${id}`)
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
	}
}

export default useCustomNavigate
