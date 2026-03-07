import { FeedbackStatus } from ".";

/**
 * Respresents an `Feedback` entity.
 */
export type Feedback = {
  /** Unique feedback id */
  id: string;

  /** Sender e-mail address */
  email: string;

  /** Feedback title/subject */
  title: string;

  /** Full feedback message body */
  message: string;

  /** ISO timestamp string when the feedback was created */
  createdAt: string;

  /** Feedback status object */
  feedbackStatus: FeedbackStatus;
};
