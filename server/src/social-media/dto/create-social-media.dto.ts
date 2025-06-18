import { IsString, Length } from 'class-validator';

export class CreateSocialMediaDto {
  @IsString({ message: 'Социальная сеть должна быть строкой' })
  @Length(1, 40, {
    message: 'Длина социальной сети должна быть от 1 до 40 символов',
  })
  name: string;
}
