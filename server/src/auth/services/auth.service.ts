import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { InvalidCredentialsException } from '../../exceptions/invalid-credentials.exception';
import { RolesService } from '../../roles/roles.service';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UserWithPasswordResponseDto } from '../../users/dto/user-with-password-response.dto';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      await this.usersService.findByEmail(loginDto.email, true);

    if (
      !user ||
      !(await this.usersService.verifyPassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new InvalidCredentialsException();
    }

    return plainToClass(UserResponseDto, user);
  }

  async login(res: Response, user: UserResponseDto) {
    const role = await this.rolesService.findByName(user.role.role);

    const validRole = this.rolesService.getValidRole(role.role);

    const payload: IJwtAuthPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: validRole,
      isActive: user.isActive,
    };

    const tokens = this.tokensService.generateAuthTokens(payload);

    const refreshToken = await this.tokensService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user, accessToken: tokens.accessToken };
  }

  async logout(res: Response, refreshToken: string) {
    const decodedToken = this.tokensService.decodeRefreshToken(refreshToken);

    await this.tokensService.deleteRefreshToken(decodedToken.id);

    res.clearCookie('refreshToken');
  }

  async refresh(res: Response, refreshToken: string) {
    const decodedToken = this.tokensService.decodeRefreshToken(refreshToken);

    const savedToken = await this.tokensService.getStoredRefreshToken(
      decodedToken.id,
    );

    if (!(await bcrypt.compare(refreshToken, savedToken.tokenHash))) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(decodedToken.id);
    return this.login(res, plainToClass(UserResponseDto, user));
  }

  async register(res: Response, registerDto: RegisterDto) {
    await this.usersService.isUserExists(
      registerDto.email,
      registerDto.nickname,
    );

    const hashedPassword = await this.usersService.createPasswordHash(
      registerDto.password,
    );
    const userRole = await this.rolesService.findByName();

    try {
      const user = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: registerDto.email,
            nickname: registerDto.nickname,
            password: hashedPassword,
            roleId: userRole.id,
          },
          include: {
            role: true,
          },
        });

        await prisma.userProfile.create({
          data: { userId: user.id },
        });

        return user;
      });

      return this.login(res, plainToClass(UserResponseDto, user));
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Ошибка при выполении регистрации',
      );
    }
  }

  async activateAccount(res: Response, token: string) {
    const { id } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.ACTIVATION,
    );

    const user = await this.usersService.activateUser(id);

    return this.login(res, user);
  }

  async resetPassword(
    res: Response,
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const { id } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.RESET_PASSWORD,
    );

    await this.usersService.findOne(id);

    resetPasswordDto.password = await this.usersService.createPasswordHash(
      resetPasswordDto.password,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: resetPasswordDto,
      include: { role: true },
    });

    return this.login(res, updatedUser);
  }
}
