import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateFeedbackReplyRequestDto } from './dto/request/create-feedback-reply.request.dto';
import { FeedbackRepliesService } from './feedback-replies.service';

@Controller('feedback-replies')
export class FeedbackRepliesController {
  constructor(
    private readonly feedbackResponsesService: FeedbackRepliesService,
  ) {}

  /**
   * POST /feedback-replies
   *
   * Create and send a reply to a feedback message. Admin-only endpoint.
   *
   * Behaviour:
   * - Persists the reply in the database.
   * - Attempts to send the reply email to the feedback's author.
   * - On email delivery failure the persisted reply is deleted and an
   *   error is returned.
   *
   * @param dto Reply creation payload
   * @param req Authenticated request (provides `req.user.id` as author)
   * @returns Serialized `FeedbackReplyDto` for the created reply
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async create(
    @Body() dto: CreateFeedbackReplyRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.feedbackResponsesService.create(dto, req.user.id);
  }

  /**
   * GET /feedback-replies/feedback/:id
   *
   * Load the reply for a specific feedback message. Admin-only.
   * Returns 404 (`EntityNotFoundException`) when no reply exists for the
   * provided feedback id.
   *
   * @param id Parent feedback id
   * @returns `FeedbackReplyDto` for the requested feedback
   */
  @Get('feedback/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findByFeedbackId(@Param('id') id: string) {
    const response = await this.feedbackResponsesService.findByFeedbackId(id);

    if (!response) {
      throw new EntityNotFoundException('Ответ на сообщение', 'feedbackId', id);
    }

    return response;
  }
}
