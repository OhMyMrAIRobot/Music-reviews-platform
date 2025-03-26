import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;
}
