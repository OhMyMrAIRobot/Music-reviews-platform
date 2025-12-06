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

	/** User */
	user: {
		minEmailLength: 1,
		maxEmailLength: 60,
		minNicknameLength: 3,
		maxNicknameLength: 20,
		minPasswordLength: 6,
		maxPasswordLength: 64,
	} as const,

	/** Author Confirmation */
	authorConfirmation: {
		minConfirmationLength: 1,
		maxConfirmationLength: 300,
		minArraySize: 1,
		maxArraySize: 5,
	} as const,
} as const
