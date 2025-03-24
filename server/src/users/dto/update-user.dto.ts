import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина пароля должна составлять от 6 до 64 символов (включительно)',
  })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, {
    message:
      'Длина никнейма должна составлять от 3 до 20 символов (включительно)',
  })
  nickname?: string;

  @IsOptional()
  @IsString({ message: 'Новый пароль должен быть строкой' })
  @Length(6, 64, {
    message:
      'Длина нового пароля должна составлять от 6 до 64 символов (включительно)',
  })
  newPassword?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
