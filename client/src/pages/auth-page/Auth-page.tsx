import { Outlet } from 'react-router'
import AuthLayout from './ui/Auth-layout'

const AuthPage = () => {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	)
}

export default AuthPage
