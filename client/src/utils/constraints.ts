/**
 * Constraints for various text fields in the application.
 */
export const constraints = {
	/** Review */
	review: {
		minTitleLength: 10,
		maxTitleLength: 100,
		minTextLength: 300,
		maxTextLength: 8500,
	} as const,

	/** Author Comment */
	authorComment: {
		minTitleLength: 5,
		maxTitleLength: 100,
		minTextLength: 300,
		maxTextLength: 8500,
	} as const,

	/** Release Media */
	releaseMedia: {
		minTitleLength: 10,
		maxTitleLength: 100,
		minUrlLength: 5,
		maxUrlLength: 255,
	} as const,

	/** Feedback */
	feedback: {
		minEmailLength: 1,
		maxEmailLength: 100,
		minTitleLength: 5,
		maxTitleLength: 50,
		minMessageLength: 100,
		maxMessageLength: 4000,
	} as const,
} as const
