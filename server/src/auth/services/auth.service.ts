import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { PrismaService } from '../../../prisma/prisma.service';
import { RolesService } from '../../roles/roles.service';
import { InvalidCredentialsException } from '../../shared/exceptions/invalid-credentials.exception';
import { UserWithPasswordResponseDto } from '../../users/dto/response/user-with-password.response.dto';
import { UserResponseDto } from '../../users/dto/response/user.response.dto';
import { UsersService } from '../../users/users.service';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { ResetPasswordRequestDto } from '../dto/request/reset-password.request.dto';
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

  async validateUser(dto: LoginRequestDto): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      await this.usersService.findByEmail(dto.email, true);

    if (
      !user ||
      !(await this.usersService.verifyPassword(dto.password, user.password))
    ) {
      throw new InvalidCredentialsException();
    }

    return plainToInstance(UserResponseDto, user);
  }

  async login(res: Response, user: UserResponseDto) {
    const role = await this.rolesService.findById(user.role.id);

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
    return this.login(res, plainToInstance(UserResponseDto, user));
  }

  async register(res: Response, dto: RegisterRequestDto) {
    await this.usersService.isUserExists(dto.email, dto.nickname);

    const hashedPassword = await this.usersService.createPasswordHash(
      dto.password,
    );
    const userRole = await this.rolesService.findByName(UserRoleEnum.USER);

    try {
      const user = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: dto.email,
            nickname: dto.nickname,
            password: hashedPassword,
            roleId: userRole.id,
          },
          include: {
            role: true,
            registeredAuthor: true,
          },
        });

        await prisma.userProfile.create({
          data: { userId: user.id },
        });

        return user;
      });

      return this.login(res, plainToInstance(UserResponseDto, user));
    } catch {
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
    dto: ResetPasswordRequestDto,
  ) {
    const { id } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.RESET_PASSWORD,
    );

    await this.usersService.findOne(id);

    dto.password = await this.usersService.createPasswordHash(dto.password);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { role: true, registeredAuthor: true },
    });

    return this.login(res, plainToInstance(UserResponseDto, updatedUser));
  }
}
