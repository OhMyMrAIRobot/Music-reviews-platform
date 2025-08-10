export const ROUTES = {
	MAIN: '/',
	RELEASE_DETAILS_PREFIX: 'release',
	RELEASE_DETAILS: 'release/:id',
	RELEASES: 'releases',
	AUTHOR_DETAILS_PREFIX: 'author',
	AUTHOR_DETAILS: 'author/:id',
	AUTHORS: 'authors',
	FEEDBACK: 'feedback',
	REVIEWS: 'reviews',
	LEADERBOARD: 'leaderboard',
	RATINGS: 'ratings',
	SEARCH_PREFIX: 'search',
	SEARCH: 'search/:type',
	PROFILE_PREFIX: 'profile',
	PROFILE: 'profile/:id',
	EDIT_PROFILE: 'profile/edit',
	MEDIA_REVIEWS: 'media-reviews',
	AUTHOR_COMMENTS: 'author-comments',
	REGISTERED_AUTHORS: 'registered-authors',
	AUTH: {
		PREFIX: 'auth',
		LOGIN: 'login',
		REGISTER: 'register',
		REQUEST_RESET: 'request-reset',
		RESET_PASSWORD: 'reset-password/:token',
		ACTIVATE: 'activate',
		ACTIVATE_WITH_TOKEN: 'activate/:token',
		NOT_DEFINED: '*',
	},
	ADMIN: {
		PREFIX: 'admin',
		USERS: 'users',
		AUTHORS: 'authors',
		RELEASES: 'releases',
		REVIEWS: 'reviews',
		FEEDBACK: 'feedback',
		MEDIA: 'media',
		NOT_DEFINED: '*',
	},
	NOT_DEFINED: '*',
} as const

export type AppRoutes =
	| keyof typeof ROUTES
	| keyof typeof ROUTES.AUTH
	| keyof typeof ROUTES.ADMIN
