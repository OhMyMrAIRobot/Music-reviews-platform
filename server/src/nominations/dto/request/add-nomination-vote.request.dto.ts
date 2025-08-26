import { IsIn } from 'class-validator';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class AddNominationVoteRequestDto {
  @IsEntityId()
  nominationTypeId: string;

  @IsIn(['author', 'release'])
  entityKind: NominationEntityKind;

  @IsEntityId()
  entityId: string;
}
