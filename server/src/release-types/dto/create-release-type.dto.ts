import { IsString, Length } from 'class-validator';

export class CreateReleaseTypeDto {
  @IsString({ message: 'Поле type должно быть строкой' })
  @Length(3, 30, { message: 'Длина типа должна быть от 3 до 30 символов' })
  type: string;
}
