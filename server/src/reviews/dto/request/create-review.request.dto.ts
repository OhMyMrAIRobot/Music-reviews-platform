import { Exclude } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TitleAndTextTogether } from '../../decorators/title-and-text-together.decorator';

export class CreateReviewRequestDto {
  @IsInt({ message: 'Оценка "Рифмы / образы" должны быть целым числом' })
  @Min(1, { message: 'Оценка "Рифмы / образы" должны от 1 до 10' })
  @Max(10, { message: 'Оценка "Рифмы / образы" должны от 1 до 10' })
  rhymes: number;

  @IsInt({ message: 'Оценка "Структура / Ритмика" должны быть целым числом' })
  @Min(1, { message: 'Оценка "Структура / Ритмика" должны от 1 до 10' })
  @Max(10, { message: 'Оценка "Структура / Ритмика" должны от 1 до 10' })
  structure: number;

  @IsInt({ message: 'Оценка "Реализация стиля" должны быть целым числом' })
  @Min(1, { message: 'Оценка "Реализация стиля" должны от 1 до 10' })
  @Max(10, { message: 'Оценка "Реализация стиля" должны от 1 до 10' })
  realization: number;

  @IsInt({
    message: 'Оценка "Индивидуальность / Харизма" должны быть целым числом',
  })
  @Min(1, { message: 'Оценка "Индивидуальность / Харизма" должны от 1 до 10' })
  @Max(10, { message: 'Оценка "Индивидуальность / Харизма" должны от 1 до 10' })
  individuality: number;

  @IsInt({
    message: 'Оценка "Атмосфера / Вайб" должны быть целым числом',
  })
  @Min(1, { message: 'Оценка "Атмосфера / Вайб" должны от 1 до 10' })
  @Max(10, { message: 'Оценка "Атмосфера / Вайб" должны от 1 до 10' })
  atmosphere: number;

  @IsOptional()
  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(100, {
    message: 'Длина заголовок не должна превышать 100 символов',
  })
  @MinLength(10, { message: 'Длина заголовока должна превышать 10 символов' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Текст должен быть строкой' })
  @MaxLength(8500, {
    message: 'Длина текста не должна превышать 8500 символов',
  })
  @MinLength(300, { message: 'Длина текста должена превышать 300 символов' })
  text?: string;

  @IsString({ message: 'Поле releaseId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseId не должно быть пустым' })
  releaseId: string;

  @Exclude()
  @TitleAndTextTogether()
  create_titleAndTextValidation?: boolean;
}
