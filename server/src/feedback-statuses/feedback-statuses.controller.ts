import { Controller, Get, Param } from '@nestjs/common';
import { FeedbackStatusesService } from './feedback-statuses.service';

@Controller('feedback-statuses')
export class FeedbackStatusesController {
  constructor(
    private readonly feedbackStatusesService: FeedbackStatusesService,
  ) {}

  @Get()
  findAll() {
    return this.feedbackStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackStatusesService.findOne(id);
  }
}
