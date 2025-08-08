import { IsEmail, IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;
}
