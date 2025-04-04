import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserFavAuthorDto {
  @IsString({ message: 'Поле authorId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле authorId не должно быть пустым' })
  authorId: string;
}
