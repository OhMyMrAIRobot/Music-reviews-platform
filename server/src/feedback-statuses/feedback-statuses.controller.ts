import { Controller, Get, Param } from '@nestjs/common';
import { FeedbackStatusesService } from './feedback-statuses.service';

@Controller('feedback-statuses')
export class FeedbackStatusesController {
  constructor(
    private readonly feedbackStatusesService: FeedbackStatusesService,
  ) {}

  /**
   * GET /feedback-statuses
   *
   * Returns a list of feedback statuses.
   *
   * @returns Promise<FeedbackStatus[]>
   */
  @Get()
  findAll() {
    return this.feedbackStatusesService.findAll();
  }

  /**
   * GET /feedback-statuses/:id
   *
   * Returns a single feedback status by id. If the id does not exist the
   * service will throw `EntityNotFoundException` which is translated to
   * a 404 response.
   *
   * @param id - feedback status entity id
   * @returns Promise<FeedbackStatus>
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackStatusesService.findOne(id);
  }
}
