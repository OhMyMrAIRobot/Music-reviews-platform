import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxDate,
  MinDate,
} from 'class-validator';

export class CreateReleaseDto {
  @IsString({ message: 'Поле title должно быть строкой' })
  @Length(1, 50, { message: 'Длина названия должна быть от 1 до 50 символов' })
  title: string;

  @IsDate({ message: 'Дата публикации должна быть корректной датой' })
  @MinDate(new Date('1400-01-01'), {
    message: 'Дата публикации не может быть раньше 1400 года',
  })
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() + 3)), {
    message: `Дата публикации не может быть позже ${new Date().getFullYear() + 3} года`,
  })
  publishDate: Date;

  @Length(1, 255, { message: 'Длина обложки должна быть от 1 до 255 символов' })
  @IsUrl({}, { message: 'Обложка должна быть корректным URL-адресом' })
  img: string;

  @IsString({ message: 'Поле releaseTypeId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseTypeId не должно быть пустым' })
  releaseTypeId: string;
}
