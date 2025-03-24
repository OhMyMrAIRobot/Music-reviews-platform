import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Роль должна быть строкой' })
  @Length(3, 40, { message: 'Длина роли должна быть от 3 до 40 символов' })
  role: string;
}
