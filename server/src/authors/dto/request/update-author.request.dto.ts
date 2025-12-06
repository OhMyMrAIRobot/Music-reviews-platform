import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAuthorRequestDto } from './create-author.request.dto';

/**
 * DTO for updating an existing author.
 *
 * Extends the `CreateAuthorRequestDto` as a partial type so all create fields are optional for updates. Additionally allows two boolean flags to request clearing the stored avatar or cover images.
 */
export class UpdateAuthorRequestDto extends PartialType(
  CreateAuthorRequestDto,
) {
  /**
   * If true, the author's avatar will be cleared/removed.
   */
  @IsOptional()
  @IsBoolean({ message: 'Поле clearAvatar должно быть булевым значением!' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearAvatar?: boolean;

  /**
   * If true, the author's cover image will be cleared/removed.
   */
  @IsOptional()
  @IsBoolean({ message: 'Поле clearCover должно быть булевым значением!' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  clearCover?: boolean;
}
