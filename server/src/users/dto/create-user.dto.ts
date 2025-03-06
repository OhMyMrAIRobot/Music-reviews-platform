import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Length(1, 60)
  email: string;

  @IsString()
  @Length(3, 40)
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  roleId: string;
}
