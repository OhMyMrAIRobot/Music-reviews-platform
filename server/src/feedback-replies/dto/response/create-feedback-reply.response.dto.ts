import { Expose, Type } from 'class-transformer';
import { FeedbackReplyResponseDto } from './feedback-reply.response.dto';

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
  @Type(() => FeedbackReplyResponseDto)
  feedbackReply: FeedbackReplyResponseDto | null;

  @Expose()
  @Type(() => FeedbackStatus)
  feedbackStatus: FeedbackStatus | null;
}
