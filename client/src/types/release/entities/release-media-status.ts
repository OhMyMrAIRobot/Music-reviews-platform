import { ReleaseMediaStatusesEnum } from '..'

/**
 * Represents an `ReleaseMediaStatus` entity.
 */
export type ReleaseMediaStatus = {
	/** Unique identifier */
	id: string

	/** Human-readable status */
	status: ReleaseMediaStatusesEnum
}
