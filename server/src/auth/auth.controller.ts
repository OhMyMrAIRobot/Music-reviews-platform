import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { MailsService } from '../mails/mails.service';
import { CodeRequestDto } from './dto/code-request.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthNoActiveGuard } from './guards/jwt-auth-no-active.guard';
import { AuthService } from './services/auth.service';
import { TokensService } from './services/tokens.service';
import { IAuthenticatedRequest } from './types/authenticated-request.interface';
import { IRequestWithCookies } from './types/request-cookies.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailsService: MailsService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    const result = await this.authService.register(res, registerDto);
    const activationToken = this.tokensService.generateActivationToken(
      result.user.id,
      result.user.email,
    );

    let emailSent = true;
    try {
      await this.mailsService.sendRegistrationEmail(
        result.user.email,
        result.user.nickname,
        activationToken,
      );
    } catch (e) {
      emailSent = false;
      console.log(e);
    }

    return res.status(200).send({ ...result, emailSent: emailSent });
  }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    const result = await this.authService.login(res, user);
    return res.status(200).send(result);
  }

  @Post('activate')
  async activate(@Res() res: Response, @Query('token') token: string) {
    const result = await this.authService.activateAccount(res, token);
    res.status(200).send(result);
  }

  @Post('refresh')
  async refresh(@Req() req: IRequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      return res.status(401).send('Refresh token not found');
    }

    const result = await this.authService.refresh(res, refreshToken);

    return res.status(200).send(result);
  }

  @Post('logout')
  async logout(@Req() req: IRequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      return res.status(401).send('Refresh token not found');
    }

    await this.authService.logout(res, refreshToken);
    return res.status(200).send();
  }

  @UseGuards(JwtAuthNoActiveGuard)
  @Post('resend-activation')
  async resendActivationCode(@Request() req: IAuthenticatedRequest) {
    const { user } = req;
    const activationToken = this.tokensService.generateActivationToken(
      user.id,
      user.email,
    );

    let emailSent = true;
    try {
      await this.mailsService.sendActivationEmail(
        user.email,
        user.nickname,
        activationToken,
      );
    } catch (e) {
      emailSent = false;
      console.log(e);
    }
    return { emailSent };
  }

  @Post('send-reset-password')
  async sendResetPasswordCode(@Body() codeRequestDto: CodeRequestDto) {
    const user = await this.usersService.findByEmail(codeRequestDto.email);
    const resetToken = this.tokensService.generateResetToken(
      user.id,
      user.email,
    );

    let emailSent = true;
    try {
      await this.mailsService.sendResetPasswordEmail(
        user.email,
        user.nickname,
        resetToken,
      );
    } catch (e) {
      emailSent = false;
      console.log(e);
    }

    return { emailSent };
  }

  @Post('reset-password')
  async resetPassword(
    @Res() res: Response,
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const result = await this.authService.resetPassword(
      res,
      token,
      resetPasswordDto,
    );
    res.status(200).send(result);
  }
}
