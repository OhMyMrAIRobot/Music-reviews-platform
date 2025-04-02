import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteReviewDto {
  @IsString({ message: 'Поле releaseId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле releaseId не должно быть пустым' })
  releaseId: string;
}
