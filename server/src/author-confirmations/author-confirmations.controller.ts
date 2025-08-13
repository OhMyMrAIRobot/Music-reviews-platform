import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from 'src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { AuthorsService } from 'src/authors/authors.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthorConfirmationsService } from './author-confirmations.service';
import { CreateAuthorConfirmationRequestDto } from './dto/request/create-author-confirmation.request.dto';

@Controller('author-confirmations')
export class AuthorConfirmationsController {
  constructor(
    private readonly authorConfirmationsService: AuthorConfirmationsService,
    private readonly authorConfirmationStatusesService: AuthorConfirmationStatusesService,
    private readonly authorsService: AuthorsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: IAuthenticatedRequest,
    @Body() dto: CreateAuthorConfirmationRequestDto,
  ) {
    const status = await this.authorConfirmationStatusesService.findByStatus(
      AuthorConfirmationStatusesEnum.PENDING,
    );
    const user = await this.usersService.findOne(req.user.id);
    await Promise.all(
      dto.authorIds.map((authorId) => this.authorsService.findOne(authorId)),
    );

    const createData = dto.authorIds.map((authorId) => ({
      userId: user.id,
      authorId,
      confirmation: dto.confirmation,
      statusId: status.id,
    }));

    return this.authorConfirmationsService.create(createData);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findByUserId(@Request() req: IAuthenticatedRequest) {
    return this.authorConfirmationsService.findByUserId(req.user.id);
  }
}
