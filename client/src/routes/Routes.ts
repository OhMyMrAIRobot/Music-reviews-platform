// routes.constants.ts
export const ROUTES = {
	AUTH: {
		AUTH: '/auth/*',
		LOGIN: '/login',
		REGISTER: '/register',
		REQUEST_RESET: '/request-reset',
		RESET_PASSWORD: '/reset-password/:token',
		ACTIVATE: '/activate',
		ACTIVATE_WITH_TOKEN: '/activate/:token',
	},
	MAIN: '/',
	RELEASE: '/release/:id',
	RELEASES: '/releases',
	AUTHOR: '/author/:id',
	AUTHORS: '/authors',
	FEEDBACK: '/feedback',
	REVIEWS: '/reviews',
	LEADERBOARD: '/leaderboard',
	RATINGS: '/ratings',
	SEARCH: '/search/:type',
	PROFILE: '/profile/:id',
} as const

export type AppRoutes = keyof typeof ROUTES | keyof typeof ROUTES.AUTH
