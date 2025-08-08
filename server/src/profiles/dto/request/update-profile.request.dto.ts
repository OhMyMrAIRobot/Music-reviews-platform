import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString({ message: 'Описание профиля должно быть строкой' })
  @Length(0, 255, {
    message: 'Описание профиля не должно превышать 255 символов',
  })
  bio?: string;

  @IsOptional()
  @IsBoolean()
  clearAvatar?: boolean;

  @IsOptional()
  @IsBoolean()
  clearCover?: boolean;
}
