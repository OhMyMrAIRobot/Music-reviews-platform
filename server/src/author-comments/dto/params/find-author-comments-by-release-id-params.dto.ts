import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindAuthorCommentsByReleaseIdParams {
  @IsEntityId()
  releaseId: string;
}
