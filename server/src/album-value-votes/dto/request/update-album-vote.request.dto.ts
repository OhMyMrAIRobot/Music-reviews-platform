import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumVoteRequestDto } from './create-album-vote.request.dto';

/**
 * Request DTO for updating an album value vote.
 *
 * All fields are optional and mirror the create DTO. PartialType is used
 * so callers may submit only the fields they wish to update.
 */
export class UpdateAlbumVoteRequestDto extends PartialType(
  CreateAlbumVoteRequestDto,
) {}
