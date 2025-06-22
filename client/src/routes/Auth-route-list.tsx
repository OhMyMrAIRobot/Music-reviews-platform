import { Route } from 'react-router'
import EditProfilePage from '../pages/edit-profile-page/Edit-profile-page'
import { ROUTES } from './routes-enum'

const AuthRouteList = () => {
	return (
		<>
			<Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />,
		</>
	)
}

export default AuthRouteList
