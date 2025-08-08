import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProfileSocialMediaRequestDto {
  @IsString({ message: 'Поле url должно быть строкой' })
  @IsNotEmpty({ message: 'Поле url не может быть пустым' })
  @IsUrl({}, { message: 'Поле url должно быть корректным URL-адресом' })
  url: string;
}
