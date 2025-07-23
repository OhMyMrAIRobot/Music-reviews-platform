import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateReleaseDto } from './create-release.dto';

export class UpdateReleaseDto extends PartialType(CreateReleaseDto) {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearCover?: boolean;
}
