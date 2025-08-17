import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateAuthorCommentRequestDto {
  @IsOptional()
  @IsString({ message: 'Поле title должно быть строкой!' })
  @Length(5, 100, {
    message: 'Заголовок комментария должна быть от 5 до 100 символов!',
  })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Поле text должно быть строкой!' })
  @Length(300, 8500, {
    message: 'Длина комментария должна быть от 300 до 8500 символов!',
  })
  text?: string;
}
