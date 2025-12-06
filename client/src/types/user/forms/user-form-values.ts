/**
 * Payload for updating a user from the user-facing endpoint.
 */
export type UpdateUserData = {
	/** Current password */
	password: string

	/** Optional new email for the user */
	email?: string

	/** Optional new nickname for the user */
	nickname?: string

	/** Optional new password the user wants to set */
	newPassword?: string
}

/**
 * Payload for admin updates to a user.
 */
export type AdminUpdateUserData = {
	/** Optional nickname to set for the user */
	nickname?: string

	/** Optional email to set for the user */
	email?: string

	/** Optional role id to assign to the user */
	roleId?: string

	/** Optional activation flag */
	isActive?: boolean
}
