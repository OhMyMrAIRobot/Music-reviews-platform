import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindReviewsByAuthorIdParams {
  @IsEntityId()
  authorId: string;
}
