/**
 * Represents data used to update the status of an existing feedback item.
 *
 * Only contains the target `feedbackStatusId` which must be a valid
 * entity identifier.
 */
export type UpdateFeedbackData = {
	/**
	 * Target feedback status id (entity identifier).
	 */
	feedbackStatusId: string
}
