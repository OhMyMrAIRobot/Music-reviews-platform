import { IsEmail, IsString, Length } from 'class-validator';

/**
 * DTO for user registration requests.
 *
 * Contains the minimal required information to create a new user
 * record. Validation rules enforce email, nickname and password
 * constraints.
 */
export class RegisterRequestDto {
  /**
   * Email address for the new user.
   */
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email: string;

  /**
   * Desired nickname for the user.
   */
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, {
    message:
      'Длина никнейма должна составлять от 3 до 20 символов (включительно)',
  })
  nickname: string;

  /**
   * Plaintext password. Will be hashed before persisting.
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;
}
