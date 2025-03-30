import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReleaseDto {
  @IsString({ message: 'Поле title должно быть строкой' })
  @Length(1, 50, { message: 'Длина названия должна быть от 1 до 50 символов' })
  title: string;

  @IsInt({ message: 'Год публикации должен быть целым числом' })
  @Min(1400, { message: 'Год публикации должен быть больше 1400' })
  @Max(new Date().getFullYear() + 3, {
    message: `Год публикации не должен быть больше ${new Date().getFullYear() + 3}`,
  })
  year: number;

  @Length(1, 255, { message: 'Длина обложки должна быть от 1 до 255 символов' })
  @IsUrl({}, { message: 'Обложка должна быть корректным URL-адресом' })
  img: string;

  @IsString({ message: 'Поле releaseTypeId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseTypeId не должно быть пустым' })
  releaseTypeId: string;
}
