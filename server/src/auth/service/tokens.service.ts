import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
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
      expiresIn: '15min',
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
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  generateResetToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.RESET_PASSWORD,
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
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
