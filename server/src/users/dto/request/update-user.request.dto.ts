import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * DTO for updating a user from the user-facing endpoint.
 *
 * Validation rules are declared with `class-validator` decorators and
 * will be enforced by Nest's validation pipe.
 */
export class UpdateUserRequestDto {
  /**
   * Current password (required for sensitive operations)
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;

  /**
   * Optional new email for the user.
   */
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email?: string;

  /**
   * Optional new nickname.
   */
  @IsOptional()
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, {
    message:
      'Длина никнейма должна составлять от 3 до 20 символов (включительно)',
  })
  nickname?: string;

  /**
   * Optional new password the user wants to set.
   */
  @IsOptional()
  @IsString({ message: 'Новый пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина нового пароля должна составлять от 6 до 64 символов (включительно)',
  })
  newPassword?: string;

  /**
   * Optional flag to activate/deactivate the user (rarely used by clients).
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
