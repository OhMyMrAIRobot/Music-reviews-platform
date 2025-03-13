import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MailsService } from '../mails/mails.service';
import { CodeRequestDto } from './dto/code-request.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthNoActiveGuard } from './guards/jwt-auth-no-active.guard';
import { AuthService } from './service/auth.service';
import { TokensService } from './service/tokens.service';
import { IAuthenticatedRequest } from './types/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailsService: MailsService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
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
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}
