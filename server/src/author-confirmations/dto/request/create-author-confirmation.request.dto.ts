import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

/**
 * Request DTO used to create a new author confirmation.
 */
export class CreateAuthorConfirmationRequestDto {
  /**
   * Array of author ids to create confirmations for.
   *
   * Accepts between 1 and 5 ids. Each element must be a string id.
   */
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

  /**
   * Text of the confirmation provided by the user.
   *
   * Required string between 1 and 300 characters.
   */
  @IsString()
  @Length(1, 300, {
    message: 'Подтверждение должно быть длиной от 1 до 300 символов',
  })
  confirmation: string;
}
