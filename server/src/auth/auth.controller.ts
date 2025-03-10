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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
    return this.authService.resendActivationCode(req.user);
  }

  @Post('send-reset-password')
  async sendResetPasswordCode(@Body() senSendPasswordCodeDto: CodeRequestDto) {
    return this.authService.sendResetPassword(senSendPasswordCodeDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}
