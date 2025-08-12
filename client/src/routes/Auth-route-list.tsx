import { Route } from 'react-router'
import AuthorConfirmationPage from '../pages/author-confirmation-page/Author-confirmation-page'
import EditProfilePage from '../pages/edit-profile-page/Edit-profile-page'
import { ROUTES } from './routes-enum'

const AuthRouteList = () => {
	return (
		<>
			<Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />,
			<Route
				path={ROUTES.AUTHOR_CONFIRMATION}
				element={<AuthorConfirmationPage />}
			/>
		</>
	)
}

export default AuthRouteList
