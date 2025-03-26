import { IsEmail, Length } from 'class-validator';

export class CodeRequestDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(1, 60, {
    message: 'Email не должен быть пустым и содержать более 60 символов',
  })
  email: string;
}
