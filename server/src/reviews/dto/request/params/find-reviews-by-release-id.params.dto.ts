import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindReviewsByReleaseIdParams {
  @IsEntityId()
  releaseId: string;
}
