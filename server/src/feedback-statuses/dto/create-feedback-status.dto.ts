import { IsString, Length } from 'class-validator';

export class CreateFeedbackStatusDto {
  @IsString({ message: 'Поле status должно быть строкой' })
  @Length(1, 30, { message: 'Длина статуса должна быть от 1 до 30 символов' })
  status: string;
}
