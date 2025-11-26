import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AlbumValueVotesService } from './album-value-votes.service';
import { CreateAlbumVoteRequestDto } from './dto/request/create-album-vote.request.dto';
import { UpdateAlbumVoteRequestDto } from './dto/request/update-album-vote.request.dto';

@Controller('album-value-votes')
export class AlbumValueVotesController {
  constructor(
    private readonly albumValueVotesService: AlbumValueVotesService,
  ) {}

  /**
   * Create a new album value vote.
   *
   * Requires an authenticated user. Accepts the full set of rating fields
   * defined in `CreateAlbumVoteRequestDto`. Returns the created vote
   * representation.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateAlbumVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.albumValueVotesService.create(req.user.id, dto);
  }

  /**
   * Retrieve the authenticated user's album value vote for a given release.
   *
   * Returns the user's vote for the specified `releaseId` or throws when
   * not found.
   */
  @Get('release/:releaseId')
  @UseGuards(JwtAuthGuard)
  findUserAlbumValueVote(
    @Param('releaseId') releaseId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.albumValueVotesService.findUserAlbumValueVote(
      req.user.id,
      releaseId,
    );
  }

  /**
   * Update an existing album value vote.
   *
   * The authenticated user must be the owner of the vote. Only provided
   * fields will be updated; the DTO is partial.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.albumValueVotesService.update(id, dto, req.user.id);
  }

  /**
   * Delete an album value vote by id.
   *
   * The authenticated user must be the owner of the vote.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.albumValueVotesService.delete(id, req.user.id);
  }
}
