import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'Поле name должно быть строкой' })
  @Length(1, 50, { message: 'Длина имени должна быть от 1 до 50 символов' })
  name: string;

  @IsArray({ message: 'Поле types должно быть массивом' })
  @ArrayMinSize(1, { message: 'Должна быть хотя бы один тип' })
  @IsString({
    each: true,
    message: 'Каждый тип должен быть строкой (идентификатором)',
  })
  types: string[];
}
