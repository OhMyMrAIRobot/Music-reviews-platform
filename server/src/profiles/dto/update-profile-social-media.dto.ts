import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileSocialMediaDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  url?: string;
}
