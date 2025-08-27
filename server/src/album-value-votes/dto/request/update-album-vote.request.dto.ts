import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumVoteRequestDto } from './create-album-vote.request.dto';

export class UpdateAlbumVoteRequestDto extends PartialType(
  CreateAlbumVoteRequestDto,
) {}
