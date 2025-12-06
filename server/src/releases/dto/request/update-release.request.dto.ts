import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReleaseRequestDto } from './create-release.request.dto';

/**
 * DTO: UpdateReleaseRequestDto
 *
 * Partial DTO for updating a release. Inherits validation rules from
 * `CreateReleaseRequestDto` but makes all fields optional.
 */
export class UpdateReleaseRequestDto extends PartialType(
  CreateReleaseRequestDto,
) {
  @IsOptional()
  @IsBoolean({ message: 'Поле clearCover должно быть булевым значением!' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearCover?: boolean;
}
