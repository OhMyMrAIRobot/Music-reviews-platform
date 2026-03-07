/**
 * Represents data for creating a feedback message submitted by a user.
 *
 * Validation rules:
 * - `email` must be a valid e-mail address and 1..100 chars
 * - `title` must be a string 5..50 chars
 * - `message` must be a non-empty string 100..4000 chars
 */
export type CreateFeedbackData = {
  /** Sender e-mail address. */
  email: string;

  /** Short title/subject for the feedback message. */
  title: string;

  /** Full feedback message body. */
  message: string;
};
