import { IsString } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class CreateFeedbackReplyDto {
  @IsString()
  message: string;

  @IsEntityId()
  feedbackId: string;
}
