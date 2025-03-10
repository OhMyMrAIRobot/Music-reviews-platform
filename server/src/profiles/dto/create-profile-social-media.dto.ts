import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProfileSocialMediaDto {
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
