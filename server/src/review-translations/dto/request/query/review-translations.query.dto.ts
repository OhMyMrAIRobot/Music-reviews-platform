import { IsEnum, IsOptional } from 'class-validator';
import { LanguagesEnum } from '../../../types/languages.enum';

export class ReviewTranslationsQueryDto {
  @IsOptional()
  @IsEnum(LanguagesEnum)
  language?: LanguagesEnum;

  @IsOptional()
  @IsEnum(LanguagesEnum)
  from?: LanguagesEnum;
}
