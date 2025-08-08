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
import { FindFeedbackQuery } from './dto/request/query/find-feedback.query.dto';
import { UpdateFeedbackRequestDto } from './dto/request/update-feedback.request.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbacksService: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackRequestDto) {
    return this.feedbacksService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get()
  findAll(@Query() query: FindFeedbackQuery) {
    return this.feedbacksService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.feedbacksService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackRequestDto) {
    return this.feedbacksService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ROOT_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}
