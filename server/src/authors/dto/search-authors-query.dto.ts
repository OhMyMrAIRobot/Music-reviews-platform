import { Type } from 'class-transformer';
import { IsInt, IsOptional, Length, Max, Min } from 'class-validator';
import { IsSearchQuery } from 'src/decorators/is-search-query.decorator';

export class SearchAuthorsQueryDto {
  @IsOptional()
  @IsSearchQuery()
  @Length(1, 50, {
    message: 'Длина поисковой строки должна быть от 1 до 50 символов',
  })
  searchQuery?: string;

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
