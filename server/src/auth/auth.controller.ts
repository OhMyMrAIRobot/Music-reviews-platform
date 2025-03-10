import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IAuthenticatedRequest } from './types/authenticated-request.interface';
import { JwtAuthNoActiveGuard } from './guards/jwt-auth-no-active.guard';
import { CodeRequestDto } from './dto/code-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailsService } from '../mails/mails.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailsService: MailsService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    const activationToken = this.authService.generateActivationToken(
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

    return { ...result, emailSent: emailSent };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @Post('activate')
  async activate(@Query('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @UseGuards(JwtAuthNoActiveGuard)
  @Post('resend-activation')
  async resendActivationCode(@Request() req: IAuthenticatedRequest) {
    const { user } = req;
    const activationToken = this.authService.generateActivationToken(
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
    const userWithResetToken =
      await this.authService.checkUserAndGetResetToken(codeRequestDto);

    let emailSent = true;
    try {
      await this.mailsService.sendResetPasswordEmail(
        userWithResetToken.user.email,
        userWithResetToken.user.nickname,
        userWithResetToken.token,
      );
    } catch (e) {
      emailSent = false;
      console.log(e);
    }

    return { emailSent };
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}
