import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { InvalidCredentialsException } from 'src/shared/exceptions/invalid-credentials.exception';
import { PrismaService } from '../../../prisma/prisma.service';
import { RolesService } from '../../roles/roles.service';
import { UserDto } from '../../users/dto/response/user.dto';
import { UsersService } from '../../users/users.service';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { ResetPasswordRequestDto } from '../dto/request/reset-password.request.dto';
import { JwtActionEnum } from '../types/jwt-action.enum';
import { AuthService } from './auth.service';
import { REFRESH_TOKEN_TTL_MS, TokensService } from './tokens.service';

function baseRawUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'u1',
    email: 'e@test.com',
    nickname: 'nick',
    password: 'hash',
    isActive: true,
    roleId: 'r1',
    role: { id: 'r1', role: UserRoleEnum.USER },
    registeredAuthor: [],
    createdAt: new Date(),
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: jest.Mock;
    verifyPassword: jest.Mock;
    findOne: jest.Mock;
    isUserExists: jest.Mock;
    createPasswordHash: jest.Mock;
  };
  let rolesService: {
    findById: jest.Mock;
    getValidRole: jest.Mock;
    findByName: jest.Mock;
  };
  let tokensService: {
    generateAuthTokens: jest.Mock;
    saveRefreshToken: jest.Mock;
    decodeRefreshToken: jest.Mock;
    decodeActionToken: jest.Mock;
    validateVerificationToken: jest.Mock;
    validateResetPasswordToken: jest.Mock;
  };
  let prisma: {
    refreshToken: {
      findUnique: jest.Mock;
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      verifyPassword: jest.fn(),
      findOne: jest.fn(),
      isUserExists: jest.fn(),
      createPasswordHash: jest.fn(),
    };
    rolesService = {
      findById: jest.fn(),
      getValidRole: jest.fn().mockReturnValue(UserRoleEnum.USER),
      findByName: jest.fn(),
    };
    tokensService = {
      generateAuthTokens: jest.fn().mockReturnValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        jti: 'jti-1',
      }),
      saveRefreshToken: jest.fn().mockResolvedValue(undefined),
      decodeRefreshToken: jest.fn(),
      decodeActionToken: jest.fn(),
      validateVerificationToken: jest.fn().mockResolvedValue(undefined),
      validateResetPasswordToken: jest.fn().mockResolvedValue(undefined),
    };
    prisma = {
      refreshToken: {
        findUnique: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: RolesService, useValue: rolesService },
        { provide: TokensService, useValue: tokensService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('validateUser', () => {
    it('throws when user is missing', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser({
          email: 'a@b.com',
          password: 'x',
        } as LoginRequestDto),
      ).rejects.toBeInstanceOf(InvalidCredentialsException);
    });

    it('throws when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(baseRawUser());
      usersService.verifyPassword.mockResolvedValue(false);

      await expect(
        service.validateUser({
          email: 'e@test.com',
          password: 'wrong',
        } as LoginRequestDto),
      ).rejects.toBeInstanceOf(InvalidCredentialsException);
    });

    it('returns UserDto on success', async () => {
      usersService.findByEmail.mockResolvedValue(baseRawUser());
      usersService.verifyPassword.mockResolvedValue(true);

      const u = await service.validateUser({
        email: 'e@test.com',
        password: 'ok',
      } as LoginRequestDto);

      expect(u).toBeInstanceOf(UserDto);
      expect(u.id).toBe('u1');
    });
  });

  describe('login', () => {
    it('sets refresh cookie and returns tokens', async () => {
      const res = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
      };
      usersService.findByEmail.mockResolvedValue(baseRawUser());
      usersService.verifyPassword.mockResolvedValue(true);
      rolesService.findById.mockResolvedValue({
        id: 'r1',
        role: UserRoleEnum.USER,
      });
      const user = await service.validateUser({
        email: 'e@test.com',
        password: 'ok',
      } as LoginRequestDto);

      const out = await service.login(res as never, user);

      expect(out.accessToken).toBe('access');
      expect(tokensService.saveRefreshToken).toHaveBeenCalledWith(
        user.id,
        'jti-1',
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
    });
  });

  describe('logout', () => {
    it('clears cookie when decode fails', async () => {
      tokensService.decodeRefreshToken.mockImplementation(() => {
        throw new Error('bad');
      });
      const res = { cookie: jest.fn(), clearCookie: jest.fn() };

      await service.logout(res as never, 'tok');

      expect(prisma.refreshToken.deleteMany).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    });

    it('deletes refresh row when decode succeeds', async () => {
      tokensService.decodeRefreshToken.mockReturnValue({
        id: 'u1',
        jti: 'jti-x',
        email: 'e',
        nickname: 'n',
        role: UserRoleEnum.USER,
        isActive: true,
      });
      const res = { cookie: jest.fn(), clearCookie: jest.fn() };

      await service.logout(res as never, 'tok');

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'u1', jti: 'jti-x' },
      });
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('refresh', () => {
    const decoded = {
      id: 'u1',
      jti: 'jti-old',
      email: 'e@test.com',
      nickname: 'nick',
      role: UserRoleEnum.USER,
      isActive: true,
    };

    it('throws when jti is missing', async () => {
      tokensService.decodeRefreshToken.mockReturnValue({
        ...decoded,
        jti: undefined,
      });

      await expect(service.refresh({} as never, 't')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('throws when stored session is missing', async () => {
      tokensService.decodeRefreshToken.mockReturnValue(decoded);
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh({} as never, 't')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('throws when session expired', async () => {
      tokensService.decodeRefreshToken.mockReturnValue(decoded);
      prisma.refreshToken.findUnique.mockResolvedValue({
        userId: 'u1',
        jti: 'jti-old',
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh({} as never, 't')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rotates refresh token on success', async () => {
      tokensService.decodeRefreshToken.mockReturnValue(decoded);
      prisma.refreshToken.findUnique.mockResolvedValue({
        userId: 'u1',
        jti: 'jti-old',
        expiresAt: new Date(Date.now() + 60_000),
      });
      usersService.findOne.mockResolvedValue(baseRawUser());
      rolesService.findById.mockResolvedValue({
        id: 'r1',
        role: UserRoleEnum.USER,
      });
      tokensService.generateAuthTokens.mockReturnValue({
        accessToken: 'a1',
        refreshToken: 'r1',
        jti: 'jti-new',
      });

      const txRefresh = {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        create: jest.fn().mockResolvedValue({}),
      };
      prisma.$transaction.mockImplementation(
        async (
          fn: (t: { refreshToken: typeof txRefresh }) => Promise<unknown>,
        ) => fn({ refreshToken: txRefresh }),
      );

      const res = { cookie: jest.fn(), clearCookie: jest.fn() };
      const out = await service.refresh(res as never, 'tok');

      expect(out.accessToken).toBe('a1');
      expect(txRefresh.create).toHaveBeenCalled();
      type RefreshTxCreateArg = {
        data: { userId: string; jti: string; expiresAt: Date };
      };
      type TxCreateCall = [RefreshTxCreateArg];
      const txCreateCalls = txRefresh.create.mock.calls as TxCreateCall[];
      const createArg = txCreateCalls[0]?.[0];
      if (createArg === undefined) {
        throw new Error('expected refreshToken.create call');
      }
      expect(createArg.data.userId).toBe('u1');
      expect(createArg.data.jti).toBe('jti-new');
      expect(createArg.data.expiresAt).toBeInstanceOf(Date);
      const expMs = createArg.data.expiresAt.getTime();
      expect(expMs - Date.now()).toBeLessThanOrEqual(
        REFRESH_TOKEN_TTL_MS + 2000,
      );
      expect(expMs - Date.now()).toBeGreaterThanOrEqual(
        REFRESH_TOKEN_TTL_MS - 2000,
      );
      expect(res.cookie).toHaveBeenCalled();
    });

    it('throws when rotation deletes zero rows', async () => {
      tokensService.decodeRefreshToken.mockReturnValue(decoded);
      prisma.refreshToken.findUnique.mockResolvedValue({
        userId: 'u1',
        jti: 'jti-old',
        expiresAt: new Date(Date.now() + 60_000),
      });
      usersService.findOne.mockResolvedValue(baseRawUser());
      rolesService.findById.mockResolvedValue({
        id: 'r1',
        role: UserRoleEnum.USER,
      });
      tokensService.generateAuthTokens.mockReturnValue({
        accessToken: 'a1',
        refreshToken: 'r1',
        jti: 'jti-new',
      });
      prisma.$transaction.mockImplementation(
        async (fn: (t: unknown) => Promise<unknown>) =>
          fn({
            refreshToken: {
              deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
              create: jest.fn(),
            },
          }),
      );

      await expect(service.refresh({} as never, 'tok')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('creates user and logs in', async () => {
      usersService.isUserExists.mockResolvedValue(undefined);
      usersService.createPasswordHash.mockResolvedValue('hashed');
      rolesService.findByName.mockResolvedValue({ id: 'role-u' });
      const created = baseRawUser({
        id: 'new',
        email: 'new@t.com',
        nickname: 'newn',
        password: 'hashed',
        isActive: false,
        roleId: 'role-u',
        role: { id: 'role-u', role: UserRoleEnum.USER },
      });
      prisma.$transaction.mockImplementation(
        async (fn: (p: unknown) => Promise<unknown>) =>
          fn({
            user: {
              create: jest.fn().mockResolvedValue(created),
            },
            userProfile: {
              create: jest.fn().mockResolvedValue({}),
            },
          }),
      );
      rolesService.findById.mockResolvedValue({
        id: 'role-u',
        role: UserRoleEnum.USER,
      });
      const res = { cookie: jest.fn(), clearCookie: jest.fn() };
      const dto = {
        email: 'new@t.com',
        nickname: 'newn',
        password: 'secret12',
      } as RegisterRequestDto;

      const out = await service.register(res as never, dto);

      expect(out.user.email).toBe('new@t.com');
      expect(out.accessToken).toBe('access');
      expect(res.cookie).toHaveBeenCalled();
    });

    it('throws InternalServerError when transaction fails', async () => {
      usersService.isUserExists.mockResolvedValue(undefined);
      usersService.createPasswordHash.mockResolvedValue('hashed');
      rolesService.findByName.mockResolvedValue({ id: 'role-u' });
      prisma.$transaction.mockRejectedValue(new Error('db'));

      await expect(
        service.register(
          {} as never,
          {
            email: 'new@t.com',
            nickname: 'newn',
            password: 'secret12',
          } as RegisterRequestDto,
        ),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('activateAccount', () => {
    it('throws when user already active', async () => {
      tokensService.decodeActionToken.mockReturnValue({
        id: 'u1',
        email: 'e',
        type: JwtActionEnum.ACTIVATION,
        jti: 'j',
      });
      usersService.findOne.mockResolvedValue(baseRawUser({ isActive: true }));

      await expect(
        service.activateAccount({} as never, 'tok'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('activates and logs in', async () => {
      tokensService.decodeActionToken.mockReturnValue({
        id: 'u1',
        email: 'e',
        type: JwtActionEnum.ACTIVATION,
        jti: 'j',
      });
      usersService.findOne.mockResolvedValue(baseRawUser({ isActive: false }));
      const updated = baseRawUser({ isActive: true });
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            user: {
              update: jest.fn().mockResolvedValue(updated),
            },
            verificationToken: {
              deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
          }),
      );
      rolesService.findById.mockResolvedValue({
        id: 'r1',
        role: UserRoleEnum.USER,
      });
      const res = { cookie: jest.fn(), clearCookie: jest.fn() };

      const out = await service.activateAccount(res as never, 'tok');

      expect(out.accessToken).toBe('access');
      expect(res.cookie).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('updates password and logs in', async () => {
      tokensService.decodeActionToken.mockReturnValue({
        id: 'u1',
        email: 'e',
        type: JwtActionEnum.RESET_PASSWORD,
        jti: 'j',
      });
      usersService.findOne.mockResolvedValue(baseRawUser());
      usersService.createPasswordHash.mockResolvedValue('newhash');
      const updated = baseRawUser({ password: 'newhash' });
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            user: {
              update: jest.fn().mockResolvedValue(updated),
            },
            resetPasswordToken: {
              delete: jest.fn().mockResolvedValue({}),
            },
          }),
      );
      rolesService.findById.mockResolvedValue({
        id: 'r1',
        role: UserRoleEnum.USER,
      });
      const res = { cookie: jest.fn(), clearCookie: jest.fn() };
      const dto = { password: 'newpass1' } as ResetPasswordRequestDto;

      const out = await service.resetPassword(res as never, 'tok', dto);

      expect(dto.password).toBe('newhash');
      expect(out.accessToken).toBe('access');
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
