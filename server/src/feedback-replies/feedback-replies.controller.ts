import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { CreateFeedbackReplyDto } from './dto/create-feedback-reply.dto';
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
    @Body() createFeedbackResponseDto: CreateFeedbackReplyDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.feedbackResponsesService.create(
      createFeedbackResponseDto,
      req.user.id,
    );
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
