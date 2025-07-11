import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileImagesDto {
  @IsOptional()
  @IsString({ message: 'Аватар должен быть строкой' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Обложка должна быть строкой' })
  coverImage?: string;
}
