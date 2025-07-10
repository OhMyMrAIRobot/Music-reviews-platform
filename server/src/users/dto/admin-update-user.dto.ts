import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, {
    message:
      'Длина никнейма должна составлять от 3 до 20 символов (включительно)',
  })
  nickname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email?: string;

  @IsOptional()
  @IsEntityId()
  roleId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
