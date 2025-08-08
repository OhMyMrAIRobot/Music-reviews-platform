import { IsString } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class CreateFeedbackReplyRequestDto {
  @IsString()
  message: string;

  @IsEntityId()
  feedbackId: string;
}
