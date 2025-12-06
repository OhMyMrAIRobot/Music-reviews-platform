import { Exclude, Expose, Type } from 'class-transformer';

/**
 * Simple DTO describing the feedback status nested object.
 */
class FeedbackStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

/**
 * Serialized feedback item returned by feedback endpoints.
 */
export class FeedbackDto {
  /** Unique feedback id */
  @Expose()
  id: string;

  /** Sender e-mail address */
  @Expose()
  email: string;

  /** Feedback title/subject */
  @Expose()
  title: string;

  /** Full feedback message body */
  @Expose()
  message: string;

  /** ISO timestamp string when the feedback was created */
  @Expose()
  createdAt: string;

  /** Feedback status object */
  @Expose()
  @Type(() => FeedbackStatus)
  feedbackStatus: FeedbackStatus;

  /** Internal FK to status entity (excluded from serialized output) */
  @Exclude()
  feedbackStatusId: string;
}
