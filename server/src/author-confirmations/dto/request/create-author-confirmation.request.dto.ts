import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

export class CreateAuthorConfirmationRequestDto {
  @IsArray({ message: 'Поле authorIds должно быть массивом' })
  @ArrayMinSize(1, {
    message: 'Минимальная длина массива с идентификаторами: 1',
  })
  @ArrayMaxSize(5, {
    message: 'Максимальная длина массива с идентификаторами: 5',
  })
  @IsString({
    each: true,
    message: 'Каждый элемент должен быть строкой (идентификатором)',
  })
  authorIds: string[];

  @IsString()
  @Length(1, 300, {
    message: 'Подтверждение должно быть длиной от 1 до 300 символов',
  })
  confirmation: string;
}
