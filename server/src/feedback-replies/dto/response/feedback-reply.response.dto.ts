import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/utils/format-full-date';

class FeedbackReplyUser {
  @Expose()
  nickname: string;
}

export class FeedbackReplyResponseDto {
  @Expose()
  id: string;

  @Expose()
  message: string;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
  createdAt: string;

  @Expose()
  feedbackId: string;

  @Expose()
  @Type(() => FeedbackReplyUser)
  user: FeedbackReplyUser | null;

  @Exclude()
  userId: string | null;
}
