import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class FindReleasesByAuthorIdQuery {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  findAll?: boolean = false;
}
