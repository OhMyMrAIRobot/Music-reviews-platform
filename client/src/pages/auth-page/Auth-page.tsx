import AuthRoutes from '../../routes/Auth-routes'
import AuthContainer from './ui/Auth-container'

const AuthPage = () => {
	return (
		<AuthContainer>
			<AuthRoutes />
		</AuthContainer>
	)
}

export default AuthPage
