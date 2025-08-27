import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class FindAlbumValueByReleaseIdParams {
  @IsEntityId()
  releaseId: string;
}
