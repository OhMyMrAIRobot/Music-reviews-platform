import { Route, Routes } from 'react-router'
import ActivationForm from '../pages/auth-page/ui/forms/Activation-form'
import LoginForm from '../pages/auth-page/ui/forms/Login-form'
import RegistrationForm from '../pages/auth-page/ui/forms/Registration-form'
import ReqResetPasswordForm from '../pages/auth-page/ui/forms/Req-reset-password-form'
import ResetPasswordForm from '../pages/auth-page/ui/forms/Reset-password-form'
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
