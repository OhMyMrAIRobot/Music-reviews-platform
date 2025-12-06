import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * DTO for admin updates to a user.
 *
 * Admin endpoints may update a subset of user properties including
 * role assignment and activation state. Validation is enforced via
 * decorators.
 */
export class AdminUpdateUserRequestDto {
  /**
   * Optional nickname to set for the user.
   */
  @IsOptional()
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, {
    message:
      'Длина никнейма должна составлять от 3 до 20 символов (включительно)',
  })
  nickname?: string;

  /**
   * Optional email to set for the user.
   */
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email?: string;

  /**
   * Optional role id to assign to the user.
   */
  @IsOptional()
  @IsEntityId()
  roleId?: string;

  /**
   * Optional activation flag.
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
