import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindReleaseDetailsParams {
  @IsEntityId()
  id: string;
}
