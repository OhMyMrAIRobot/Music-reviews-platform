import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { TokensService } from 'src/auth/services/tokens.service';
import { MailsService } from 'src/mails/mails.service';
import { AuthService } from '../auth/services/auth.service';
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { AdminUpdateUserRequestDto } from './dto/request/admin-update-user.request.dto';
import { UsersQueryDto } from './dto/request/query/users.query.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly mailsService: MailsService,
  ) {}

  /**
   * PATCH /users
   *
   * Update the authenticated user's profile. Requires authentication.
   * On success this endpoint returns new auth tokens and a flag
   * indicating whether an activation email was sent (when email changed).
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() res: Response,
    @Request() req: IAuthenticatedRequest,
    @Body() dto: UpdateUserRequestDto,
  ) {
    const user = await this.usersService.update(req.user.id, dto);
    const result = await this.authService.login(res, user);

    let emailSent = false;
    if (!user.isActive) {
      const activationToken = await this.tokensService.generateActivationToken(
        user.id,
        user.email,
      );
      try {
        await this.mailsService.sendActivationEmail(
          user.email,
          user.nickname,
          activationToken,
        );
        emailSent = true;
      } catch {
        emailSent = false;
      }
    }

    return res.status(200).send({ ...result, emailSent });
  }

  /**
   * DELETE /users
   *
   * Delete the authenticated user's account. Requires authentication.
   * Performs cleanup of profile files and related data.
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req: IAuthenticatedRequest) {
    return this.usersService.delete(req.user.id);
  }

  /**
   * GET /users
   *
   * Admin-only endpoint. Returns a paginated list of users according to
   * provided query parameters. Delegates to `UsersService.findAll`.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  /**
   * GET /users/:id
   *
   * Admin-only endpoint. Returns detailed information for a single user,
   * including profile and social media. Delegates to
   * `UsersService.findUserDetails` which throws when the user does not exist.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findUserDetails(@Param('id') id: string) {
    return this.usersService.findUserDetails(id);
  }

  /**
   * PATCH /users/:id
   *
   * Admin-only endpoint to update any user's fields. Validates admin
   * permissions and delegates to `UsersService.adminUpdate`.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.usersService.adminUpdate(id, dto, req);
  }

  /**
   * DELETE /users/:id
   *
   * Admin-only endpoint to delete a user by id. Enforces permissions and
   * delegates deletion to `UsersService.adminDelete`.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async removeById(
    @Param('id') id: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.usersService.adminDelete(req, id);
  }
}
