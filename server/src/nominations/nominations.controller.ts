import { Controller, Get, Query } from '@nestjs/common';
import { FindNominationWinnersQueryDto } from './dto/query/find-nomination-winners.query.dto';
import { NominationsService } from './nominations.service';

@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Get()
  findWinners(@Query() query: FindNominationWinnersQueryDto) {
    return this.nominationsService.findNominationWinners(query);
  }
}
