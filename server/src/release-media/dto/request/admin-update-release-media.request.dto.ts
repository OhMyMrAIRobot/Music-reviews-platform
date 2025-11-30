import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateReleaseMediaRequestDto } from './admin-create-release-media.request.dto';

/**
 * Administrative DTO for partially updating release media.
 *
 * All fields are optional and match `AdminCreateReleaseMediaRequestDto`.
 */
export class AdminUpdateReleaseMediaRequestDto extends PartialType(
  AdminCreateReleaseMediaRequestDto,
) {}
