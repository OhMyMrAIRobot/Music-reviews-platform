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

	return {
		navigateToLogin,
		navigateToRegistration,
		navigateToRequestReset,
		navigateToMain,
		navigateToFeedback,
	}
}

export default useCustomNavigate
