export const authorConfirmationsKeys = {
	all: ['authorConfirmations'] as const,
	byCurrentUser: () => ['authorConfirmations', 'byCurrentUser'] as const,
}
