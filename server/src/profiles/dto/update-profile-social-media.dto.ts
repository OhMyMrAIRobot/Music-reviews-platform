import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileSocialMediaDto {
  @IsString({ message: 'Поле url должно быть строкой' })
  @IsNotEmpty({ message: 'Поле url не может быть пустым' })
  @IsUrl({}, { message: 'Некорректный формат url' })
  @IsOptional()
  url?: string;
}
