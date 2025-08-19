import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindNominationWinnersByAuthorIdParams } from './dto/params/find-nomination-winners-by-author-id.params.dto';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
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
}
