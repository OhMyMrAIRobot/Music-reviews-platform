import { IsOptional, IsString, Length } from 'class-validator';

/**
 * UpdateAuthorCommentRequestDto — partial payload for updating an author's
 * comment. All fields are optional; validations mirror creation rules.
 */
export class UpdateAuthorCommentRequestDto {
  /** Optional updated title (5–100 characters). */
  @IsOptional()
  @IsString({ message: 'Поле title должно быть строкой!' })
  @Length(5, 100, {
    message: 'Заголовок комментария должна быть от 5 до 100 символов!',
  })
  title?: string;

  /** Optional updated text (300–8500 characters). */
  @IsOptional()
  @IsString({ message: 'Поле text должно быть строкой!' })
  @Length(300, 8500, {
    message: 'Длина комментария должна быть от 300 до 8500 символов!',
  })
  text?: string;
}
