import { IsString, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * DTO for creating a reply to a feedback message.
 *
 * Validation rules:
 * - `message` must be a string and between 100 and 8500 characters
 * - `feedbackId` must be a valid entity id
 */
export class CreateFeedbackReplyRequestDto {
  /** Full reply message to be sent to the user. */
  @IsString({ message: 'Поле message должно быть строкой!' })
  @Length(100, 8500, {
    message: 'Длина сообщения должна быть от 100 до 8500 символов!',
  })
  message: string;

  /** Parent feedback id this reply belongs to. */
  @IsEntityId()
  feedbackId: string;
}
