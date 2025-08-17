import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from 'src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { AuthorsService } from 'src/authors/authors.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UsersService } from 'src/users/users.service';
import { AuthorConfirmationsService } from './author-confirmations.service';
import { FindAuthorConfirmationsQuery } from './dto/query/find-author-confirmations-query.dto';
import { CreateAuthorConfirmationRequestDto } from './dto/request/create-author-confirmation.request.dto';
import { UpdateAuthorConfirmationRequestDto } from './dto/request/update-author-confirmation.request.dto';

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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  async findAll(@Query() query: FindAuthorConfirmationsQuery) {
    return this.authorConfirmationsService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorConfirmationRequestDto,
  ) {
    return this.authorConfirmationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  async delete(@Param('id') id: string) {
    return this.authorConfirmationsService.delete(id);
  }
}
