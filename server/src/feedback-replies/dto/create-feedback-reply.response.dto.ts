import { Expose, Type } from 'class-transformer';
import { FeedbackReplyDto } from './feedback-reply.dto';

class FeedbackStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

export class CreateFeedbackReplyResponseDto {
  @Expose()
  isSent: boolean;

  @Expose()
  @Type(() => FeedbackReplyDto)
  feedbackReply: FeedbackReplyDto | null;

  @Expose()
  @Type(() => FeedbackStatus)
  feedbackStatus: FeedbackStatus | null;
}
