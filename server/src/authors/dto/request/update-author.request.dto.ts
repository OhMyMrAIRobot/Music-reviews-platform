import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
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
  @Type(() => Boolean)
  clearAvatar?: boolean;

  /**
   * If true, the author's cover image will be cleared/removed.
   */
  @IsOptional()
  @Type(() => Boolean)
  clearCover?: boolean;
}
