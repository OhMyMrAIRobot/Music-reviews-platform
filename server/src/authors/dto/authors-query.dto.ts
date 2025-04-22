import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class AuthorsQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'typeId может содержать только цифры и буквы',
  })
  typeId?: string;

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
