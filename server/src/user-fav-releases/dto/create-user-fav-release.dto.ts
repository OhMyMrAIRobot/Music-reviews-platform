import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserFavReleaseDto {
  @IsString({ message: 'Поле releaseId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseId не должно быть пустым' })
  releaseId: string;
}
