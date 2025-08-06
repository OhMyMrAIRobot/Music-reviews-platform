import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class FindAuthorParamsDto {
  @IsEntityId()
  id: string;
}
