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
import { FindUsersQuery } from './dto/request/query/find-users.query.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly mailsService: MailsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Res() res: Response,
    @Request() req: IAuthenticatedRequest,
    @Body() dto: UpdateUserRequestDto,
  ) {
    const user = await this.usersService.update(req.user.id, dto);
    const result = await this.authService.login(res, user);

    let emailSent = false;
    if (!user.isActive) {
      const activationToken = this.tokensService.generateActivationToken(
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

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Request() req: IAuthenticatedRequest) {
    return this.usersService.delete(req.user.id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: FindUsersQuery) {
    return this.usersService.findAll(query);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findUserDetails(@Param('id') id: string) {
    return this.usersService.findUserDetails(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.usersService.adminUpdate(id, dto, req);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async removeById(
    @Param('id') id: string,
    @Request() req: IAuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.adminDelete(req, id);
  }
}
