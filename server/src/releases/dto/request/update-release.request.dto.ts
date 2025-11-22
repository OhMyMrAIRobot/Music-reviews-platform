import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
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
  @Type(() => Boolean)
  @IsBoolean({ message: 'Поле clearCover должно быть булевым значением' })
  clearCover?: boolean;
}
