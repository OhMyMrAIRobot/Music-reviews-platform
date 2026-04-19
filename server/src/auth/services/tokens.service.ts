import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InvalidTokenException } from 'src/shared/exceptions/invalid-token.exception';
import { IJwtActionPayload } from '../types/jwt-action-payload.interface';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Generate access and refresh tokens for authenticated users.
   *
   * Both tokens are signed with their respective secrets and have
   * configurable expiration times. The access token is used for API
   * authorization while the refresh token allows obtaining new access tokens.
   *
   * @param payload - JWT payload containing user authentication data
   * @returns object with `accessToken` and `refreshToken` strings
   */
  generateAuthTokens(payload: IJwtAuthPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30day', // 15min
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30day',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate an account activation token.
   *
   * Creates a short-lived JWT with `type: JwtActionEnum.ACTIVATION` for
   * verifying user email during account activation flows.
   *
   * @param id - user id to embed in the token
   * @param email - user email to embed in the token
   * @returns signed JWT string valid for 1 hour
   */
  generateActivationToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.ACTIVATION,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACTION_SECRET,
      expiresIn: '1h',
    });
  }

  /**
   * Generate a password reset token.
   *
   * Creates a short-lived JWT with `type: JwtActionEnum.RESET_PASSWORD` for
   * secure password reset flows.
   *
   * @param id - user id to embed in the token
   * @param email - user email to embed in the token
   * @returns signed JWT string valid for 15 minutes
   */
  async generateResetToken(id: string, email: string): Promise<string> {
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.RESET_PASSWORD,
      jti,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACTION_SECRET,
      expiresIn: '15min',
    });
    await this.prisma.resetPasswordToken.upsert({
      where: { userId: id },
      create: {
        userId: id,
        jti,
        expiresAt,
      },
      update: {
        jti,
        expiresAt,
      },
    });
    return token;
  }

  async validateResetPasswordToken(
    userId: string,
    jti: string | undefined,
  ): Promise<void> {
    if (!jti) {
      throw new InvalidTokenException();
    }
    const record = await this.prisma.resetPasswordToken.findUnique({
      where: { userId },
    });
    if (!record || record.jti !== jti) {
      throw new InvalidTokenException();
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new InvalidTokenException();
    }
  }

  /**
   * Decode and validate an action token (activation or password reset).
   *
   * Verifies the token signature using `JWT_ACTION_SECRET` and ensures the
   * decoded payload type matches the expected `JwtActionEnum` value.
   *
   * @param token - JWT action token string to decode
   * @param type - expected action type from JwtActionEnum
   * @returns decoded IJwtActionPayload on success
   * @throws InvalidTokenException when token is invalid or type mismatches
   */
  decodeActionToken(token: string, type: JwtActionEnum): IJwtActionPayload {
    try {
      const decodedToken = this.jwtService.verify<IJwtActionPayload>(token, {
        secret: process.env.JWT_ACTION_SECRET,
      });

      if (decodedToken.type !== type) {
        throw new InvalidTokenException();
      }

      return decodedToken;
    } catch {
      throw new InvalidTokenException();
    }
  }

  /**
   * Decode and validate a refresh token.
   *
   * Verifies the refresh token signature using `JWT_REFRESH_SECRET` and
   * returns the decoded authentication payload.
   *
   * @param token - JWT refresh token string to decode
   * @returns decoded IJwtAuthPayload
   * @throws InvalidTokenException when token verification fails
   */
  decodeRefreshToken(token: string): IJwtAuthPayload {
    try {
      return this.jwtService.verify<IJwtAuthPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new InvalidTokenException();
    }
  }

  /**
   * Persist a refresh token for a user (hashed).
   *
   * Hashes the provided refresh token using bcrypt and stores it in the
   * database using an upsert operation. Returns the original raw token.
   *
   * @param userId - id of the user owning the refresh token
   * @param refreshToken - raw JWT refresh token to hash and store
   * @returns the original refreshToken string
   */
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<string> {
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        tokenHash,
      },
      create: {
        userId,
        tokenHash,
      },
    });

    return refreshToken;
  }

  /**
   * Retrieve stored refresh token record for a user.
   *
   * Returns the Prisma RefreshToken entity containing the hashed token.
   *
   * @param userId - id of the user whose refresh token to retrieve
   * @returns RefreshToken record from database
   * @throws EntityNotFoundException when no refresh token exists
   */
  async getStoredRefreshToken(userId: string): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new EntityNotFoundException('Refresh token', 'userId', `${userId}`);
    }

    return token;
  }

  /**
   * Delete the stored refresh token for a user.
   *
   * Looks up and removes the refresh token record from the database.
   * Returns the deleted record on success.
   *
   * @param userId - id of the user whose refresh token to delete
   * @returns deleted RefreshToken record
   * @throws EntityNotFoundException when no refresh token exists
   */
  async deleteRefreshToken(userId: string): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new EntityNotFoundException('Refresh token', 'userId', `${userId}`);
    }

    const result = await this.prisma.refreshToken.delete({
      where: { userId },
    });

    return result;
  }
}
