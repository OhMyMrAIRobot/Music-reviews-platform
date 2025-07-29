import { IsString, IsUrl, Length } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class AdminCreateReleaseMediaRequestDto {
  @IsString({ message: 'Заголовок должен быть строкой!' })
  @Length(10, 100, {
    message: 'Заголовок должен быть длиной от 10 до 100 символов!',
  })
  title: string;

  @IsUrl({}, { message: 'URL должен быть корректным!' })
  @Length(1, 255, {
    message: 'URL должен быть длиной от 1 до 255 символов!',
  })
  url: string;

  @IsEntityId()
  releaseId: string;

  @IsEntityId()
  releaseMediaTypeId: string;

  @IsEntityId()
  releaseMediaStatusId: string;
}
