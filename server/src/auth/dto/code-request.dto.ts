import { IsEmail, Length } from 'class-validator';

export class CodeRequestDto {
  @IsEmail()
  @Length(1, 60)
  email: string;
}