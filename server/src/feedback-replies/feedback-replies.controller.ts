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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Post()
  async create(
    @Body() dto: CreateFeedbackReplyRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.feedbackResponsesService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get('feedback/:id')
  async findByFeedbackId(@Param('id') id: string) {
    const response = await this.feedbackResponsesService.findByFeedbackId(id);

    if (!response) {
      throw new EntityNotFoundException('Ответ на сообщение', 'feedbackId', id);
    }

    return response;
  }
}
