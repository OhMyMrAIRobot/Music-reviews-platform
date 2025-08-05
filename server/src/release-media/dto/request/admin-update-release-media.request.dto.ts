import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateReleaseMediaRequestDto } from './admin-create-release-media.request.dto';

export class AdminUpdateReleaseMediaRequestDto extends PartialType(
  AdminCreateReleaseMediaRequestDto,
) {}
