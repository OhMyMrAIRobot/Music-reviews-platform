import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFeedbackDto {
  @IsString({ message: 'Статус должен быть строкой' })
  @IsNotEmpty({ message: 'Статус не должен быть пустым' })
  feedbackStatusId: string;
}
