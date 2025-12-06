import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';

/**
 * DTO for creating a new author.
 *
 * This request expects the author's display `name` and a non-empty array of `types` (author type identifiers).
 */
export class CreateAuthorRequestDto {
  /**
   * Author display name.
   * - Required string
   * - Length: 1..50 characters
   */
  @IsString({ message: 'Поле name должно быть строкой' })
  @Length(1, 50, { message: 'Длина имени должна быть от 1 до 50 символов' })
  name: string;

  /**
   * Array of author type identifiers.
   * - Required non-empty array
   * - Each item must be a string (type id)
   */
  @IsArray({ message: 'Поле types должно быть массивом' })
  @ArrayMinSize(1, { message: 'Должен быть хотя бы один тип' })
  @IsString({
    each: true,
    message: 'Каждый тип должен быть строкой (идентификатором)',
  })
  types: string[];
}
