import { IsNotEmpty, IsString } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * DTO used to update the status of an existing feedback item.
 *
 * Only contains the target `feedbackStatusId` which must be a valid
 * entity identifier.
 */
export class UpdateFeedbackRequestDto {
  /**
   * Target feedback status id (entity identifier).
   */
  @IsString({ message: 'Статус должен быть строкой' })
  @IsNotEmpty({ message: 'Статус не должен быть пустым' })
  @IsEntityId()
  feedbackStatusId: string;
}
