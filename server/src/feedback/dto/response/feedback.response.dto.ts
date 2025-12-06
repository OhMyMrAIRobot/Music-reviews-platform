import { FeedbackDto } from './feedback.dto';

/** Paginated response envelope for feedback list endpoints. */
export type FeedbackResponseDto = {
  meta: MetaInfo;
  items: FeedbackDto[];
};

/** Basic pagination/meta information returned with lists. */
export type MetaInfo = {
  /** Total number of items in the current result set */
  count: number;
};
