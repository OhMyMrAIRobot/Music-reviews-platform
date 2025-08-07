import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateReleaseRequestDto } from './create-release.response.dto';

export class UpdateReleaseRequestDto extends PartialType(
  CreateReleaseRequestDto,
) {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearCover?: boolean;
}
