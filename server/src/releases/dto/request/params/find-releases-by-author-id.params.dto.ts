import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class FindReleasesByAuthorIdParams {
  @IsEntityId()
  authorId: string;
}
