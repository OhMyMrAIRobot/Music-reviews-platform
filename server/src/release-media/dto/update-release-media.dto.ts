import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseMediaDto } from './create-release-media.dto';

/**
 * DTO for updating a `ReleaseMedia` record.
 *
 * All fields are optional and mirror `CreateReleaseMediaDto`. Use this
 * DTO when performing partial updates to an existing media entry.
 */
export class UpdateReleaseMediaDto extends PartialType(CreateReleaseMediaDto) {}
