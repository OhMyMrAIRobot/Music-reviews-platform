import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class UpdateAuthorConfirmationRequestDto {
  @IsEntityId()
  statusId: string;
}
