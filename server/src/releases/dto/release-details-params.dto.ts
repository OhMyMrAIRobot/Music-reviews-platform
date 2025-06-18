import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class ReleaseDetailsParamsDto {
  @IsEntityId()
  id: string;
}
