import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class ReleaseReviewParamsDto {
  @IsEntityId()
  id: string;
}
