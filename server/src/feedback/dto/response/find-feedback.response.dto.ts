import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/shared/utils/format-full-date';

class FeedbackStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

export class FindFeedbackResponseDto {
  count: number;
  feedback: FeedbackResponseItem[];
}

export class FeedbackResponseItem {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  title: string;

  @Expose()
  message: string;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
  createdAt: string;

  @Expose()
  @Type(() => FeedbackStatus)
  feedbackStatus: FeedbackStatus;

  @Exclude()
  feedbackStatusId: string;
}
