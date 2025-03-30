import { IsString } from 'class-validator';

export class CreateAuthorsOnTypeDto {
  @IsString({ message: 'Поле authorId должно быть строкой' })
  authorId: string;

  @IsString({ message: 'Поле authorTypeId должно быть строкой' })
  authorTypeId: string;
}
