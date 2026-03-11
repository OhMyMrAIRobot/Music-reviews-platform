import { FeedbackStatusesEnum } from '../enums';

/**
 * Represents a `FeedbackStatus` entity.
 */
export type FeedbackStatus = {
  id: string;
  status: FeedbackStatusesEnum;
};
