import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 100 символов',
  })
  email: string;

  @IsString({ message: 'Заголовок должен быть строкой' })
  @Length(1, 50, {
    message:
      'Длина заголовка должна составлять от 1 до 50 символов (включительно)',
  })
  title: string;

  @IsString({ message: 'Сообщение должно быть строкой' })
  @IsNotEmpty({ message: 'Сообщение не должно быть пустым' })
  message: string;
}
