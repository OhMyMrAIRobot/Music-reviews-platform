import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateAuthorRequestDto } from './create-author.request.dto';

export class UpdateAuthorRequestDto extends PartialType(
  CreateAuthorRequestDto,
) {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearAvatar?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearCover?: boolean;
}
