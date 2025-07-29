import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateReleaseMediaRequestDto {
  @IsOptional()
  @IsString({ message: 'Заголовок должен быть строкой!' })
  @Length(10, 100, {
    message: 'Заголовок должен быть длиной от 10 до 100 символов!',
  })
  title?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL должен быть корректным!' })
  @Length(1, 255, {
    message: 'URL должен быть длиной от 1 до 255 символов!',
  })
  url?: string;
}
