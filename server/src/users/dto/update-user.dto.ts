import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Length(1, 60)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 40)
  nickname?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
