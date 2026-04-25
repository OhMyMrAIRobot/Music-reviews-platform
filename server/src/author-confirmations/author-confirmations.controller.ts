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
import { AuthorConfirmationsQueryDto } from './dto/query/author-confirmations.query.dto';
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

  /**
   * Create one or more author confirmation requests on behalf of the
   * authenticated user.
   *
   * - Ensures the default `PENDING` status exists.
   * - Validates the authenticated user and that each `authorId` exists.
   * - Builds internal DTOs and delegates creation to the service which uses
   *   `createMany` with `skipDuplicates`.
   */
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

  /**
   * Return confirmations created by the authenticated user.
   *
   * Requires authentication and returns the same paginated shape as
   * the administrative `findAll` endpoint but filtered to the current user.
   */
  @Get('my-confirmations')
  @UseGuards(JwtAuthGuard)
  async findMyConfirmations(@Request() req: IAuthenticatedRequest) {
    return this.authorConfirmationsService.findAll({ userId: req.user.id });
  }

  /**
   * Administrative endpoint to list author confirmations.
   *
   * Requires admin or root admin role. Accepts filtering/search/sort and
   * pagination parameters defined by `AuthorConfirmationsQueryDto`.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findAll(@Query() query: AuthorConfirmationsQueryDto) {
    return this.authorConfirmationsService.findAll(query);
  }

  /**
   * Update the status of an author confirmation.
   *
   * Administrative endpoint. Delegates to the service which enforces
   * domain rules (e.g. cannot change status of already approved/declined
   * confirmations). Returns the updated confirmation DTO.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorConfirmationRequestDto,
  ) {
    return this.authorConfirmationsService.update(id, dto);
  }

  /**
   * Delete an author confirmation by id.
   *
   * Administrative endpoint. Ensures the confirmation exists before
   * deleting and returns the Prisma deletion result.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param('id') id: string) {
    return this.authorConfirmationsService.delete(id);
  }
}
