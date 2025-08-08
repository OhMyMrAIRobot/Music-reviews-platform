import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindProfileByUserIdParams {
  @IsEntityId()
  userId: string;
}
