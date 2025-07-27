import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { FeedbackResponsesService } from './feedback-responses.service';

@Controller('feedback-responses')
export class FeedbackResponsesController {
  constructor(
    private readonly feedbackResponsesService: FeedbackResponsesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get('feedback/:id')
  findByFeedbackId(@Param('id') id: string) {
    return this.feedbackResponsesService.findByFeedbackId(id);
  }
}
