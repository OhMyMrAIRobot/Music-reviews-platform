import { IsString, Length } from 'class-validator';

export class CreateReleaseRatingTypeDto {
  @IsString({ message: 'Поле type должно быть строкой' })
  @Length(3, 40, { message: 'Длина типа должна быть от 3 до 30 символов' })
  type: string;
}
