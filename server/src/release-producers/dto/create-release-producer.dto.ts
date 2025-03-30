import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReleaseProducerDto {
  @IsString({ message: 'Поле releaseId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseId не должно быть пустым' })
  releaseId: string;

  @IsString({ message: 'Поле authorId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле authorId не должно быть пустым' })
  authorId: string;
}
