import { FeedbackDto } from 'src/feedback/dto/response/feedback.dto';

/**
 * Serialized representation of a feedback reply returned by the API.
 *
 * Includes the reply id, message, creation timestamp, the parent
 * `FeedbackDto` and optional author `user` info (id and nickname).
 */
export type FeedbackReplyDto = {
  /** Reply id */
  id: string;

  /** Reply message body */
  message: string;

  /** ISO timestamp when the reply was created */
  createdAt: string;

  /** Parent feedback object */
  feedback: FeedbackDto;

  /** Optional author info for the reply */
  user?: User;
};

/** Minimal user info returned for reply author. */
type User = {
  id: string;
  nickname: string;
};
