import { IsString } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class CreateFeedbackReplyRequestDto {
  @IsString()
  message: string;

  @IsEntityId()
  feedbackId: string;
}
