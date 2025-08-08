import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class FindReviewsByReleaseIdParams {
  @IsEntityId()
  releaseId: string;
}
