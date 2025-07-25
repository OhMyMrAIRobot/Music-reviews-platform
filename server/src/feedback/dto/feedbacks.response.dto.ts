import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatDateCreatedAt } from 'src/users/utils/format-date-created-at';

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
  @Transform(({ value }) => formatDateCreatedAt(value as Date))
  createdAt: string;

  @Expose()
  @Type(() => FeedbackStatus)
  feedbackStatus: FeedbackStatus;

  @Exclude()
  feedbackStatusId: string;
}
