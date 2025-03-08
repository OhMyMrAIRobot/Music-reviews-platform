import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Length(1, 60)
  email: string;

  @IsString()
  @Length(6, 64)
  password: string;
}
