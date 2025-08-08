import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFeedbackRequestDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 100 символов',
  })
  email: string;

  @IsString({ message: 'Заголовок должен быть строкой' })
  @Length(5, 50, {
    message:
      'Длина заголовка должна составлять от 5 до 50 символов (включительно)',
  })
  title: string;

  @IsString({ message: 'Сообщение должно быть строкой' })
  @IsNotEmpty({ message: 'Сообщение не должно быть пустым' })
  @Length(100, 4000, {
    message:
      'Длина сообщения должна составлять от 100 до 4000 символов (включительно)',
  })
  message: string;
}
