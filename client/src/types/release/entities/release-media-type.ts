import { ReleaseMediaTypesEnum } from '..'

/**
 * Represents an `ReleaseMediaType` entity.
 */
export type ReleaseMediaType = {
	/** Unique identifier */
	id: string

	/** Human-readable type */
	type: ReleaseMediaTypesEnum
}
