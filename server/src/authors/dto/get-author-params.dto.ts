import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class GetAuthorParamsDto {
  @IsEntityId()
  id: string;
}
