/*
 * This file contains the type definition for the parameters of the useMutation hook.
 * It defines the structure of the object that can be passed to the useMutation hook
 * to specify the additional behavior of the mutation on success, error, and when it is settled.
 */
export type UseMutationParams = {
	onSuccess?: () => void
	onError?: (error: unknown) => void
	onSettled?: () => void
}
