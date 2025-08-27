import {
  Body,
  Controller,
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

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateAlbumVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.albumValueVotesService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.albumValueVotesService.update(id, dto, req.user.id);
  }
}
