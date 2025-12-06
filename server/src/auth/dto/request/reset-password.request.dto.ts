import { IsString, Length } from 'class-validator';

/**
 * DTO for password reset requests.
 *
 * The payload contains the new plaintext password which will replace the
 * existing one after validation and hashing.
 */
export class ResetPasswordRequestDto {
  /**
   * New plaintext password.
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;
}
