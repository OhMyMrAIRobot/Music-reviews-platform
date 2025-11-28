import { IsIn } from 'class-validator';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * DTO for creating a nomination vote request.
 */
export class CreateNominationVoteRequestDto {
  /**
   * Nomination type id.
   * Must be a valid entity id string.
   */
  @IsEntityId()
  nominationTypeId: string;

  /**
   * Which entity kind is being voted for: 'author' or 'release'.
   */
  @IsIn(['author', 'release'], {
    message: 'Поле entityKind должно быть "author" или "release"',
  })
  entityKind: NominationEntityKind;

  /**
   * The id of the voted entity. Must be a valid entity id.
   */
  @IsEntityId()
  entityId: string;
}
