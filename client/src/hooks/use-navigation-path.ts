import { SearchTypesEnum } from '../models/search/search-types-enum'
import { ROUTES } from '../routes/routes-enum'

const useNavigationPath = () => {
	const navigateToMain = `${ROUTES.MAIN}`

	const navigateToLogin = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.LOGIN}`

	const navigateToRegistration = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.REGISTER}`

	const navigateToRequestReset = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.REQUEST_RESET}`

	const navigateToActivation = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.ACTIVATE}`

	const navigateToFeedback = `/${ROUTES.FEEDBACK}`

	const navigateToReleases = `/${ROUTES.RELEASES}`

	const navigateToAuthors = `/${ROUTES.AUTHORS}`

	const navigateToReviews = `/${ROUTES.REVIEWS}`

	const navigateToMediaReviews = `/${ROUTES.MEDIA_REVIEWS}`

	const navigateToLeaderboard = `/${ROUTES.LEADERBOARD}`

	const navigateToRatings = `/${ROUTES.RATINGS}`

	const navigateToEditProfile = `/${ROUTES.EDIT_PROFILE}`

	const navigateToAdminUsers = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.USERS}`

	const navigateToAdminAuthors = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHORS}`

	const navigateToAdminReleases = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.RELEASES}`

	const navigateToAdminReviews = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.REVIEWS}`

	const navigateToAdminFeedback = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.FEEDBACK}`

	const navigateToAdminMedia = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.MEDIA}`

	const navigateToReleaseDetails = (id: string) =>
		`/${ROUTES.RELEASE_DETAILS_PREFIX}/${id}`

	const navigateToAuthorDetails = (id: string) =>
		`/${ROUTES.AUTHOR_DETAILS_PREFIX}/${id}`

	const navigateToSearch = (type: SearchTypesEnum, query: string) =>
		`/${ROUTES.SEARCH_PREFIX}/${type}?query=${encodeURIComponent(query)}`

	const navigatoToProfile = (id: string) => `/${ROUTES.PROFILE_PREFIX}/${id}`

	return {
		navigateToLogin,
		navigateToRegistration,
		navigateToRequestReset,
		navigateToMain,
		navigateToFeedback,
		navigateToReleaseDetails,
		navigateToAuthors,
		navigateToReviews,
		navigateToReleases,
		navigateToAuthorDetails,
		navigateToLeaderboard,
		navigateToRatings,
		navigateToSearch,
		navigatoToProfile,
		navigateToEditProfile,
		navigateToActivation,
		navigateToAdminUsers,
		navigateToAdminAuthors,
		navigateToAdminReleases,
		navigateToAdminReviews,
		navigateToAdminFeedback,
		navigateToAdminMedia,
		navigateToMediaReviews,
	}
}

export default useNavigationPath
