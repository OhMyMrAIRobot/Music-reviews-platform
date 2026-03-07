/**
 * Represents data for creating a reply to a feedback message.
 *
 * Validation rules:
 * - `message` must be a string and between 100 and 8500 characters
 * - `feedbackId` must be a valid entity id
 */
export type CreateFeedbackReplyData = {
  /** Full reply message to be sent to the user. */
  message: string;
  /** Parent feedback id this reply belongs to. */
  feedbackId: string;
};
