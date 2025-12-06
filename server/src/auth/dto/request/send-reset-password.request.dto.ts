import { IsEmail, Length } from 'class-validator';

/**
 * DTO to request sending a reset password code to a user's email.
 *
 * The controller handling this DTO will generate a reset token
 * and send it to the provided address when appropriate.
 */
export class SendResetPasswordRequestDto {
  /**
   * Email address where the reset code will be sent.
   */
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email: string;
}
