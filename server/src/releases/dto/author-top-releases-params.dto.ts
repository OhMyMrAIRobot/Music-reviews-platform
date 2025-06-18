import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class AuthorTopReleasesParamsDto {
  @IsEntityId()
  id: string;
}
