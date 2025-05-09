import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class FindProfileParamsDto {
  @IsEntityId()
  id: string;
}
