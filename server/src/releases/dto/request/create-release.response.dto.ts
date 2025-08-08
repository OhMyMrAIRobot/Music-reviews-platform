import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxDate,
  MinDate,
} from 'class-validator';

export class CreateReleaseRequestDto {
  @IsString({ message: 'Поле title должно быть строкой' })
  @Length(1, 50, { message: 'Длина названия должна быть от 1 до 50 символов' })
  title: string;

  @IsDate({ message: 'Дата должна быть валидной датой' })
  @MaxDate(new Date(), { message: 'Дата не может быть позже текущего дня' })
  @MinDate(new Date(1600, 0, 1), {
    message: 'Дата не может быть раньше 1600 года',
  })
  @Transform(({ value }: { value: Date }) => new Date(value))
  publishDate: Date;

  @IsString({ message: 'Поле releaseTypeId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseTypeId не должно быть пустым' })
  releaseTypeId: string;

  @IsOptional()
  @IsArray({ message: 'Поле releaseArtists должно быть массивом' })
  @Transform(({ value }: { value: string[] }) => {
    if (value[0] === '[]') return [];
    return value;
  })
  @IsString({
    each: true,
    message: 'Каждый элемент должен быть строкой (идентификатором)',
  })
  releaseArtists?: string[];

  @IsOptional()
  @IsArray({ message: 'Поле releaseProducers должно быть массивом' })
  @Transform(({ value }: { value: string[] }) => {
    if (value[0] === '[]') return [];
    return value;
  })
  @IsString({
    each: true,
    message: 'Каждый элемент должен быть строкой (идентификатором)',
  })
  releaseProducers?: string[];

  @IsOptional()
  @IsArray({ message: 'Поле releaseDesigners должно быть массивом' })
  @Transform(({ value }: { value: string[] }) => {
    if (value[0] === '[]') return [];
    return value;
  })
  @IsString({
    each: true,
    message: 'Каждый элемент должен быть строкой (идентификатором)',
  })
  releaseDesigners?: string[];
}
