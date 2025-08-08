import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindReleasesByAuthorIdParams {
  @IsEntityId()
  authorId: string;
}
