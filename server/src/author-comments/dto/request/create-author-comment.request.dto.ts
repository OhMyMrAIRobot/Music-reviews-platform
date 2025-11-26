import { IsString, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * CreateAuthorCommentRequestDto — payload for creating an author comment.
 *
 * Validation rules are applied via class-validator decorators.
 */
export class CreateAuthorCommentRequestDto {
  /** Comment title; required, 5–100 characters. */
  @IsString({ message: 'Поле title должно быть строкой!' })
  @Length(5, 100, {
    message: 'Заголовок комментария должна быть от 5 до 100 символов!',
  })
  title: string;

  /** Comment body text; required, 300–8500 characters. */
  @IsString({ message: 'Поле text должно быть строкой!' })
  @Length(300, 8500, {
    message: 'Длина комментария должна быть от 300 до 8500 символов!',
  })
  text: string;

  /** Target release id for which the comment is created. */
  @IsEntityId()
  releaseId: string;
}
