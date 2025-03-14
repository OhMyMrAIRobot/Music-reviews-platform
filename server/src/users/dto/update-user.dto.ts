import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(6, 64)
  password: string;

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
  @Length(6, 64)
  newPassword?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
