import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class ProfileParamsDto {
  @IsEntityId()
  userId: string;
}
