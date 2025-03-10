import { IsString, Length } from 'class-validator';

export class CreateSocialMediaDto {
  @Length(1, 40)
  @IsString()
  name: string;
}
