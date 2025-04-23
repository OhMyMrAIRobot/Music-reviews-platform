import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class ReleasesQueryDto {
  @IsOptional()
  @IsEntityId()
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
