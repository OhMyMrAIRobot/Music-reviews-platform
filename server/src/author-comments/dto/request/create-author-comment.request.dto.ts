import { IsString, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

export class CreateAuthorCommentRequestDto {
  @IsString({ message: 'Поле title должно быть строкой!' })
  @Length(5, 100, {
    message: 'Заголовок комментария должна быть от 10 до 100 символов!',
  })
  title: string;

  @IsString({ message: 'Поле text должно быть строкой!' })
  @Length(300, 8500, {
    message: 'Длина комментария должна быть от 300 до 8500 символов!',
  })
  text: string;

  @IsEntityId()
  releaseId: string;
}
