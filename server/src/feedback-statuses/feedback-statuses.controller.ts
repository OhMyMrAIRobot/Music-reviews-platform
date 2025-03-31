import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { CreateFeedbackStatusDto } from './dto/create-feedback-status.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
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

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createFeedbackStatusDto: CreateFeedbackStatusDto) {
    return this.feedbackStatusesService.create(createFeedbackStatusDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackStatusDto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackStatusesService.update(id, updateFeedbackStatusDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackStatusesService.remove(id);
  }
}
