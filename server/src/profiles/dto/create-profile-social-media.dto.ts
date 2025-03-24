import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProfileSocialMediaDto {
  @IsString({ message: 'Поле socialId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле socialId не может быть пустым' })
  socialId: string;

  @IsString({ message: 'Поле url должно быть строкой' })
  @IsNotEmpty({ message: 'Поле url не может быть пустым' })
  @IsUrl({}, { message: 'Поле url должно быть корректным URL-адресом' })
  url: string;
}
