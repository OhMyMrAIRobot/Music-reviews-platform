import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'Поле name должно быть строкой' })
  @Length(1, 50, { message: 'Длина имени должна быть от 1 до 50 символов' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Поле avatarUrl должно быть строкой' })
  @Length(0, 255, {
    message: 'Длина avatarUrl должна быть от 0 до 255 символов',
  })
  @IsUrl({}, { message: 'Поле avatarUrl должно быть корректным URL-адресом' })
  avatarImg?: string;

  @IsOptional()
  @IsString({ message: 'Поле coverUrl должно быть строкой' })
  @Length(0, 255, {
    message: 'Длина coverUrl должна быть от 0 до 255 символов',
  })
  @IsUrl({}, { message: 'Поле coverUrl должно быть корректным URL-адресом' })
  coverImg?: string;
}
