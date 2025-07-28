import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/utils/format-full-date';

class FeedbackStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

export class FeedbacksResponseDto {
  count: number;
  feedbacks: FeedbackResponseItem[];
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
