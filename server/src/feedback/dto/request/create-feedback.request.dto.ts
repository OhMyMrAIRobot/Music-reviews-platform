import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * DTO for creating a feedback message submitted by a user.
 *
 * Validation rules:
 * - `email` must be a valid e-mail address and 1..100 chars
 * - `title` must be a string 5..50 chars
 * - `message` must be a non-empty string 100..4000 chars
 */
export class CreateFeedbackRequestDto {
  /**
   * Sender e-mail address.
   */
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 100, {
    message: 'Email не должен быть пустым и содержать более 100 символов',
  })
  email: string;

  /**
   * Short title/subject for the feedback message.
   */
  @IsString({ message: 'Заголовок должен быть строкой' })
  @Length(5, 50, {
    message:
      'Длина заголовка должна составлять от 5 до 50 символов (включительно)',
  })
  title: string;

  /**
   * Full feedback message body.
   */
  @IsString({ message: 'Сообщение должно быть строкой' })
  @IsNotEmpty({ message: 'Сообщение не должно быть пустым' })
  @Length(100, 4000, {
    message:
      'Длина сообщения должна составлять от 100 до 4000 символов (включительно)',
  })
  message: string;
}
