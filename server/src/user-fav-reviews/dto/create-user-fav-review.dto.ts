import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserFavReviewDto {
  @IsString({ message: 'Поле reviewId должно быть строкой' })
  @IsNotEmpty({ message: 'Поле reviewId не должно быть пустым' })
  reviewId: string;
}
