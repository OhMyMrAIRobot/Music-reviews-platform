import AuthRoutes from '../../routes/AuthRoutes'
import AuthContainer from './ui/Auth-container'

const AuthPage = () => {
	return (
		<AuthContainer>
			<AuthRoutes />
		</AuthContainer>
	)
}

export default AuthPage
