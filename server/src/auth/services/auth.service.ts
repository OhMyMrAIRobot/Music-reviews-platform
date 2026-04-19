import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { PrismaService } from '../../../prisma/prisma.service';
import { RolesService } from '../../roles/roles.service';
import { InvalidCredentialsException } from '../../shared/exceptions/invalid-credentials.exception';
import { UserDto } from '../../users/dto/response/user.dto';
import { UsersService } from '../../users/users.service';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { ResetPasswordRequestDto } from '../dto/request/reset-password.request.dto';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';
import { REFRESH_TOKEN_TTL_MS, TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Validate user credentials for login.
   *
   * Looks up the user by email and verifies the provided password against
   * the stored hash. Returns a sanitized UserDto on success.
   *
   * @param dto - login credentials (email and password)
   * @returns UserDto for the authenticated user
   * @throws InvalidCredentialsException when email not found or password invalid
   */
  async validateUser(dto: LoginRequestDto): Promise<UserDto> {
    const user = await this.usersService.findByEmail(dto.email, true);

    if (
      !user ||
      !(await this.usersService.verifyPassword(dto.password, user.password))
    ) {
      throw new InvalidCredentialsException();
    }

    return plainToInstance(UserDto, user);
  }

  /**
   * Complete user login by generating tokens and setting cookies.
   *
   * Creates access and refresh tokens, persists the refresh session (jti) in the
   * database, and sets the refresh token as an httpOnly cookie.
   *
   * @param res - Express Response object to set cookies
   * @param user - validated UserDto for the authenticated user
   * @returns object containing user data and access token
   */
  async login(res: Response, user: UserDto) {
    const role = await this.rolesService.findById(user.role.id);

    const validRole = this.rolesService.getValidRole(role.role);

    const payload: Omit<IJwtAuthPayload, 'jti'> = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: validRole,
      isActive: user.isActive,
    };

    const tokens = this.tokensService.generateAuthTokens(payload);

    await this.tokensService.saveRefreshToken(user.id, tokens.jti);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user, accessToken: tokens.accessToken };
  }

  /**
   * Log out a user by invalidating their refresh token.
   *
   * Decodes the refresh token to identify the user, deletes the stored
   * token from the database, and clears the refresh token cookie.
   *
   * @param res - Express Response object to clear cookies
   * @param refreshToken - refresh token from the user's cookie
   */
  async logout(res: Response, refreshToken: string) {
    try {
      const decodedToken = this.tokensService.decodeRefreshToken(refreshToken);
      if (decodedToken.jti) {
        await this.prisma.refreshToken.deleteMany({
          where: { userId: decodedToken.id, jti: decodedToken.jti },
        });
      }
    } catch {
      // invalid or expired token — still clear cookie
    }

    res.clearCookie('refreshToken');
  }

  /**
   * Refresh user session using a valid refresh token.
   *
   * Validates the refresh JWT and stored session (jti), then rotates
   * the session and generates a new token pair.
   *
   * @param res - Express Response object to set new cookies
   * @param refreshToken - refresh token from the user's cookie
   * @returns object containing user data and new access token
   * @throws UnauthorizedException when refresh token is invalid or doesn't match
   */
  async refresh(res: Response, refreshToken: string) {
    let decodedToken: IJwtAuthPayload;
    try {
      decodedToken = this.tokensService.decodeRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException();
    }

    if (!decodedToken.jti) {
      throw new UnauthorizedException();
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { jti: decodedToken.jti },
    });

    if (!stored || stored.userId !== decodedToken.id) {
      throw new UnauthorizedException();
    }

    if (stored.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(decodedToken.id);
    const userDto = plainToInstance(UserDto, user);

    const role = await this.rolesService.findById(userDto.role.id);
    const validRole = this.rolesService.getValidRole(role.role);

    const payload: Omit<IJwtAuthPayload, 'jti'> = {
      id: userDto.id,
      email: userDto.email,
      nickname: userDto.nickname,
      role: validRole,
      isActive: userDto.isActive,
    };

    const tokens = this.tokensService.generateAuthTokens(payload);

    await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.refreshToken.deleteMany({
        where: { jti: decodedToken.jti, userId: userDto.id },
      });

      if (deleted.count === 0) {
        throw new UnauthorizedException();
      }

      await tx.refreshToken.create({
        data: {
          userId: userDto.id,
          jti: tokens.jti,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
      });
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user: userDto, accessToken: tokens.accessToken };
  }

  /**
   * Register a new user account.
   *
   * Validates that email and nickname are unique, hashes the password,
   * assigns the USER role, and creates both User and UserProfile records
   * in a transaction. Automatically logs in the new user on success.
   *
   * @param res - Express Response object to set cookies
   * @param dto - registration data (email, nickname, password)
   * @returns object containing user data and access token
   * @throws InternalServerErrorException on database errors during registration
   */
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

      return this.login(res, plainToInstance(UserDto, user));
    } catch {
      throw new InternalServerErrorException(
        'Ошибка при выполении регистрации',
      );
    }
  }

  /**
   * Activate a user account using an activation token.
   *
   * Decodes and validates the activation token, marks the user as active,
   * and automatically logs them in.
   *
   * @param res - Express Response object to set cookies
   * @param token - JWT activation token from email link
   * @returns object containing user data and access token
   * @throws InvalidTokenException when token is invalid or expired
   */
  async activateAccount(res: Response, token: string) {
    const { id, jti } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.ACTIVATION,
    );

    await this.tokensService.validateVerificationToken(id, jti);

    const existing = await this.usersService.findOne(id);
    if (existing.isActive) {
      throw new ConflictException('Активация не требуется!');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: { isActive: true },
        include: { role: true, registeredAuthor: true },
      });
      await tx.verificationToken.deleteMany({ where: { userId: id } });
      return plainToInstance(UserDto, updated);
    });

    return this.login(res, user);
  }

  /**
   * Reset user password using a password reset token.
   *
   * Decodes and validates the reset token, verifies the user exists,
   * hashes the new password, updates the database, and logs the user in.
   *
   * @param res - Express Response object to set cookies
   * @param token - JWT password reset token from email link
   * @param dto - new password data
   * @returns object containing user data and access token
   * @throws InvalidTokenException when token is invalid or expired
   */
  async resetPassword(
    res: Response,
    token: string,
    dto: ResetPasswordRequestDto,
  ) {
    const { id, jti } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.RESET_PASSWORD,
    );

    await this.tokensService.validateResetPasswordToken(id, jti);

    await this.usersService.findOne(id);

    dto.password = await this.usersService.createPasswordHash(dto.password);

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: dto,
        include: { role: true, registeredAuthor: true },
      });
      await tx.resetPasswordToken.delete({ where: { userId: id } });
      return user;
    });

    return this.login(res, plainToInstance(UserDto, updatedUser));
  }
}
