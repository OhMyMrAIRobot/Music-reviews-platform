/**
 * Payload for creating a new release media item (user).
 */
export type CreateReleaseMediaData = {
	/** Title shown for the media item (10-100 characters). */
	title: string

	/** Link to the media; must be a valid URL (1-255 characters). */
	url: string

	/** Target release id that this media belongs to. */
	releaseId: string
}

/**
 * Payload for updating an existing release media item (user).
 */
export type UpdateReleaseMediaData = Omit<
	Partial<CreateReleaseMediaData>,
	'releaseId'
>

/**
 * Payload for creating a new release media item (admin).
 */
export type AdminCreateReleaseMediaData = CreateReleaseMediaData & {
	/** Explicit media type id (admin-only). */
	releaseMediaTypeId: string

	/** Explicit media status id (admin-only). */
	releaseMediaStatusId: string
}

/**
 * Payload for updating an existing release media item (admin).
 */
export type AdminUpdateReleaseMediaData = Partial<AdminCreateReleaseMediaData>
