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
	AUTHORS: '/authors',
	FEEDBACK: '/feedback',
	REVIEWS: '/reviews',
	RELEASES: '/releases',
} as const

export type AppRoutes = keyof typeof ROUTES | keyof typeof ROUTES.AUTH
