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
import { UserDto } from '../../users/dto/response/user.dto';
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
   * Creates access and refresh tokens, persists the refresh token in the
   * database (hashed), and sets the refresh token as an httpOnly cookie.
   *
   * @param res - Express Response object to set cookies
   * @param user - validated UserDto for the authenticated user
   * @returns object containing user data and access token
   */
  async login(res: Response, user: UserDto) {
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
    const decodedToken = this.tokensService.decodeRefreshToken(refreshToken);

    await this.tokensService.deleteRefreshToken(decodedToken.id);

    res.clearCookie('refreshToken');
  }

  /**
   * Refresh user session using a valid refresh token.
   *
   * Validates the provided refresh token against the stored hash, then
   * generates a new token pair and updates the session.
   *
   * @param res - Express Response object to set new cookies
   * @param refreshToken - refresh token from the user's cookie
   * @returns object containing user data and new access token
   * @throws UnauthorizedException when refresh token is invalid or doesn't match
   */
  async refresh(res: Response, refreshToken: string) {
    const decodedToken = this.tokensService.decodeRefreshToken(refreshToken);

    const savedToken = await this.tokensService.getStoredRefreshToken(
      decodedToken.id,
    );

    if (!(await bcrypt.compare(refreshToken, savedToken.tokenHash))) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(decodedToken.id);
    return this.login(res, plainToInstance(UserDto, user));
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
    const { id } = this.tokensService.decodeActionToken(
      token,
      JwtActionEnum.ACTIVATION,
    );

    const user = await this.usersService.activateUser(id);

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

    return this.login(res, plainToInstance(UserDto, updatedUser));
  }
}
