import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { InvalidTokenException } from 'src/shared/exceptions/invalid-token.exception';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { REFRESH_TOKEN_TTL_MS, TokensService } from './tokens.service';

describe('TokensService', () => {
  let service: TokensService;
  let jwtService: { sign: jest.Mock; verify: jest.Mock };
  let prisma: {
    refreshToken: { create: jest.Mock };
    verificationToken: { upsert: jest.Mock; findUnique: jest.Mock };
    resetPasswordToken: { upsert: jest.Mock; findUnique: jest.Mock };
  };

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.JWT_ACTION_SECRET = 'action-secret';

    jwtService = {
      sign: jest.fn().mockReturnValue('signed'),
      verify: jest.fn(),
    };
    prisma = {
      refreshToken: { create: jest.fn().mockResolvedValue({}) },
      verificationToken: {
        upsert: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
      },
      resetPasswordToken: {
        upsert: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(TokensService);
  });

  describe('generateAuthTokens', () => {
    it('signs access and refresh with jti on refresh payload', () => {
      const payload = {
        id: 'u1',
        email: 'e@t.com',
        nickname: 'n',
        role: UserRoleEnum.USER,
        isActive: true,
      };

      const out = service.generateAuthTokens(payload);

      expect(out.accessToken).toBe('signed');
      expect(out.refreshToken).toBe('signed');
      expect(typeof out.jti).toBe('string');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      type SignCall = [payload: { jti?: string }, options: { secret: string }];
      const signCalls = jwtService.sign.mock.calls as SignCall[];
      expect(signCalls[0]?.[1]).toMatchObject({
        secret: 'access-secret',
      });
      expect(signCalls[1]?.[0].jti).toBe(out.jti);
      expect(signCalls[1]?.[1]).toMatchObject({
        secret: 'refresh-secret',
      });
    });
  });

  describe('decodeRefreshToken', () => {
    it('returns payload when verify succeeds', () => {
      const payload = {
        id: 'u1',
        email: 'e',
        nickname: 'n',
        role: UserRoleEnum.USER,
        isActive: true,
        jti: 'j',
      };
      jwtService.verify.mockReturnValue(payload);

      expect(service.decodeRefreshToken('tok')).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith('tok', {
        secret: 'refresh-secret',
      });
    });

    it('throws InvalidTokenException when verify fails', () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('expired');
      });

      expect(() => service.decodeRefreshToken('bad')).toThrow(
        InvalidTokenException,
      );
    });
  });

  describe('decodeActionToken', () => {
    it('returns payload when type matches', () => {
      const payload = {
        id: 'u1',
        email: 'e',
        type: JwtActionEnum.ACTIVATION,
        jti: 'j',
      };
      jwtService.verify.mockReturnValue(payload);

      expect(service.decodeActionToken('t', JwtActionEnum.ACTIVATION)).toEqual(
        payload,
      );
    });

    it('throws when type mismatches', () => {
      jwtService.verify.mockReturnValue({
        id: 'u1',
        email: 'e',
        type: JwtActionEnum.RESET_PASSWORD,
        jti: 'j',
      });

      expect(() =>
        service.decodeActionToken('t', JwtActionEnum.ACTIVATION),
      ).toThrow(InvalidTokenException);
    });
  });

  describe('saveRefreshToken', () => {
    it('persists refresh session with ttl', async () => {
      const before = Date.now();
      await service.saveRefreshToken('u1', 'jti-x');
      const after = Date.now();

      expect(prisma.refreshToken.create).toHaveBeenCalled();
      type RefreshCreateArg = {
        data: { userId: string; jti: string; expiresAt: Date };
      };
      type CreateCall = [RefreshCreateArg];
      const createCalls = prisma.refreshToken.create.mock.calls as CreateCall[];
      const createArg = createCalls[0]?.[0];
      expect(createArg.data.userId).toBe('u1');
      expect(createArg.data.jti).toBe('jti-x');
      const exp = createArg.data.expiresAt;
      expect(exp).toBeInstanceOf(Date);
      expect(exp.getTime() - before).toBeLessThanOrEqual(
        REFRESH_TOKEN_TTL_MS + 2000,
      );
      expect(exp.getTime() - after).toBeGreaterThanOrEqual(
        REFRESH_TOKEN_TTL_MS - 2000,
      );
    });
  });

  describe('validateVerificationToken', () => {
    it('throws when jti missing', async () => {
      await expect(
        service.validateVerificationToken('u1', undefined),
      ).rejects.toThrow(InvalidTokenException);
    });

    it('throws when record missing or jti mismatch', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue(null);

      await expect(
        service.validateVerificationToken('u1', 'j'),
      ).rejects.toThrow(InvalidTokenException);

      prisma.verificationToken.findUnique.mockResolvedValue({
        jti: 'other',
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(
        service.validateVerificationToken('u1', 'j'),
      ).rejects.toThrow(InvalidTokenException);
    });

    it('throws when expired', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue({
        jti: 'j',
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        service.validateVerificationToken('u1', 'j'),
      ).rejects.toThrow(InvalidTokenException);
    });
  });

  describe('validateResetPasswordToken', () => {
    it('throws when jti missing', async () => {
      await expect(
        service.validateResetPasswordToken('u1', undefined),
      ).rejects.toThrow(InvalidTokenException);
    });

    it('resolves when valid', async () => {
      prisma.resetPasswordToken.findUnique.mockResolvedValue({
        jti: 'j',
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(
        service.validateResetPasswordToken('u1', 'j'),
      ).resolves.toBeUndefined();
    });
  });
});
