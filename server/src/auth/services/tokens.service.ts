import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';
import { IJwtActionPayload } from '../types/jwt-action-payload.interface';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

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

  generateResetToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.RESET_PASSWORD,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACTION_SECRET,
      expiresIn: '15min',
    });
  }

  decodeActionToken(token: string, type: JwtActionEnum): IJwtActionPayload {
    try {
      const decodedToken = this.jwtService.verify<IJwtActionPayload>(token, {
        secret: process.env.JWT_ACTION_SECRET,
      });

      if (decodedToken.type !== type) {
        throw new InvalidTokenException();
      }

      return decodedToken;
    } catch (e) {
      console.log(e);
      throw new InvalidTokenException();
    }
  }

  decodeRefreshToken(token: string): IJwtAuthPayload {
    try {
      return this.jwtService.verify<IJwtAuthPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new InvalidTokenException();
      console.log(e);
    }
  }

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

  async getStoredRefreshToken(userId: string): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new EntityNotFoundException('Refresh token', 'userId', `${userId}`);
    }

    return token;
  }

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
