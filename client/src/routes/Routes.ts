// routes.constants.ts
export const ROUTES = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		REQUEST_RESET: '/auth/request-reset',
		RESET_PASSWORD: '/auth/reset-password/:token',
		ACTIVATE: '/auth/activate',
		ACTIVATE_WITH_TOKEN: '/auth/activate/:token',
	},
	MAIN: '/',
	RELEASE: '/release/:id',
	AUTHORS: '/authors',
	FEEDBACK: '/feedback',
} as const

export type AppRoutes = keyof typeof ROUTES | keyof typeof ROUTES.AUTH
