import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindNominationWinnersByAuthorIdParams {
  @IsEntityId()
  authorId: string;
}
