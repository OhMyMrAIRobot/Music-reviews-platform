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
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/services/auth.service';
import { IAuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly mailsService: MailsService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Res() res: Response,
    @Request() req: IAuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(req.user.id, updateUserDto);
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
      } catch (e) {
        emailSent = false;
        console.log(e);
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
  async findAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user-info/:id')
  async getUserFullInfo(@Param('id') id: string) {
    return this.usersService.getFullUserInfoById(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
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
