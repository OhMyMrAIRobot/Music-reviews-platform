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
} as const
