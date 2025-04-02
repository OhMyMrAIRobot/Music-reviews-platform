import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

function TitleAndTextTogether(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'TitleAndTextTogether',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const hasTitle =
            obj.title !== undefined && obj.title !== null && obj.title !== '';
          const hasText =
            obj.text !== undefined && obj.text !== null && obj.text !== '';
          return (hasTitle && hasText) || (!hasTitle && !hasText);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Либо укажите и заголовок, и текст, либо не указывайте ни одно из них';
        },
      },
    });
  };
}

export class CreateReviewDto {
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
  @MaxLength(100, { message: 'Заголовок не должен превышать 100 символов' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Текст должен быть строкой' })
  @MaxLength(8500, { message: 'Текст не должен превышать 8500 символов' })
  text?: string;

  @TitleAndTextTogether()
  titleAndTextValidation?: boolean;

  @IsString({ message: 'Поле releaseId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseId не должно быть пустым' })
  releaseId: string;
}
