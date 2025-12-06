import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * Request DTO used to update the status of an existing author confirmation.
 */
export class UpdateAuthorConfirmationRequestDto {
  /** Target status id to set on the confirmation (must be a valid entity id). */
  @IsEntityId()
  statusId: string;
}
