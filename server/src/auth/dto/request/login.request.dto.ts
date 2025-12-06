import { IsEmail, IsString, Length } from 'class-validator';

/**
 * DTO for user login requests.
 *
 * The payload is validated with `class-validator` decorators. This DTO
 * represents the credentials submitted by a client when authenticating.
 */
export class LoginRequestDto {
  /**
   * User email address used for authentication.
   */
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email: string;

  /**
   * Plaintext password.
   * Minimum and maximum length are enforced by validation rules.
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;
}
