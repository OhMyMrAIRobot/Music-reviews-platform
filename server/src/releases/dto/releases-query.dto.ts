import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class ReleasesQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'type может содержать только цифры и буквы',
  })
  type?: string;

  @IsOptional()
  @IsIn([
    'published',
    'noTextCount',
    'textCount',
    'superUserRating',
    'noTextRating',
    'withTextRating',
  ])
  field?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
