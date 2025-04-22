import { Route, Routes } from 'react-router'
import ActivationForm from '../components/auth/forms/ActivationForm'
import LoginForm from '../components/auth/forms/LoginForm'
import RegistrationForm from '../components/auth/forms/RegistrationForm'
import ReqResetPasswordForm from '../components/auth/forms/ReqResetPasswordForm'
import ResetPasswordForm from '../components/auth/forms/ResetPasswordForm'
import { ROUTES } from './Routes'

const AuthRoutes = () => {
	return (
		<Routes>
			<Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
			<Route path={ROUTES.AUTH.REGISTER} element={<RegistrationForm />} />
			<Route
				path={ROUTES.AUTH.REQUEST_RESET}
				element={<ReqResetPasswordForm />}
			/>
			<Route
				path={ROUTES.AUTH.RESET_PASSWORD}
				element={<ResetPasswordForm />}
			/>
			<Route path={ROUTES.AUTH.ACTIVATE} element={<ActivationForm />} />
			<Route
				path={ROUTES.AUTH.ACTIVATE_WITH_TOKEN}
				element={<ActivationForm />}
			/>
		</Routes>
	)
}

export default AuthRoutes
