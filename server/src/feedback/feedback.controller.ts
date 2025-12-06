import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateFeedbackRequestDto } from './dto/request/create-feedback.request.dto';
import { FeedbackQueryDto } from './dto/request/query/feedback.query.dto';
import { UpdateFeedbackRequestDto } from './dto/request/update-feedback.request.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbacksService: FeedbackService) {}

  /**
   * POST /feedback
   *
   * Create a new feedback entry. Accessible publicly (no auth required).
   * Accepts `CreateFeedbackRequestDto` in the request body.
   */
  @Post()
  create(@Body() dto: CreateFeedbackRequestDto) {
    return this.feedbacksService.create(dto);
  }

  /**
   * GET /feedback
   *
   * List feedback items. Admin-only endpoint that supports filtering,
   * search and pagination via `FeedbackQueryDto`.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  findAll(@Query() query: FeedbackQueryDto) {
    return this.feedbacksService.findAll(query);
  }

  /**
   * GET /feedback/:id
   *
   * Retrieve a single feedback item by id. Admin-only.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  findById(@Param('id') id: string) {
    return this.feedbacksService.findOne(id);
  }

  /**
   * PATCH /feedback/:id
   *
   * Update feedback status. Admin-only.
   * Expects `UpdateFeedbackRequestDto` in the request body.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackRequestDto) {
    return this.feedbacksService.update(id, dto);
  }

  /**
   * DELETE /feedback/:id
   *
   * Permanently remove a feedback entry. Restricted to `ROOT_ADMIN`.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ROOT_ADMIN)
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}
