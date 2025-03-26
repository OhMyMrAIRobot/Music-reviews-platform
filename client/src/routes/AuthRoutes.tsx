import { Route, Routes } from 'react-router'
import ActivationForm from '../components/auth/forms/ActivationForm'
import LoginForm from '../components/auth/forms/LoginForm'
import RegistrationForm from '../components/auth/forms/RegistrationForm'
import ReqResetPasswordForm from '../components/auth/forms/ReqResetPasswordForm'
import ResetPasswordForm from '../components/auth/forms/ResetPasswordForm'

const AuthRoutes = () => {
	return (
		<Routes>
			<Route path='/login' element={<LoginForm />} />
			<Route path='/register' element={<RegistrationForm />} />
			<Route path='/request-reset' element={<ReqResetPasswordForm />} />
			<Route path='/reset-password/:token' element={<ResetPasswordForm />} />
			<Route path='/activate' element={<ActivationForm />} />
			<Route path='/activate/:token' element={<ActivationForm />} />
		</Routes>
	)
}

export default AuthRoutes
