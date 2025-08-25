import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { FindNominationWinnersByAuthorIdParams } from './dto/params/find-nomination-winners-by-author-id.params.dto';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import { AddNominationVoteRequestDto } from './dto/request/add-nomination-vote.request.dto';
import { NominationsService } from './nominations.service';

@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Get()
  findWinners(@Query() query: FindNominationWinnersQueryDto) {
    return this.nominationsService.findNominationWinners(query);
  }

  @Get('author/:authorId')
  findWinnersByAuthorId(
    @Param() params: FindNominationWinnersByAuthorIdParams,
  ) {
    return this.nominationsService.findNominationWinnersByAuthorId(
      params.authorId,
    );
  }

  @Get('candidates')
  findCandidates() {
    return this.nominationsService.findCandidates();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addNominationVote(
    @Body() dto: AddNominationVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.nominationsService.addNominationVote(dto, req.user.id);
  }
}
