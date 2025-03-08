import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Length(1, 60)
  email: string;

  @IsString()
  @Length(3, 40)
  nickname: string;

  @IsString()
  @Length(6, 64)
  password: string;
}
