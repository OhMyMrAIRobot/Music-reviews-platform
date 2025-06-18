import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Аватар должен быть строкой' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Обложка должна быть строкой' })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'Биография должна быть строкой' })
  @Length(0, 255, { message: 'Биография не должна превышать 255 символов' })
  bio?: string;
}
