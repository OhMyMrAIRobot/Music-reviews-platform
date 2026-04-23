import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from 'src/file/files.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RolesService } from 'src/roles/roles.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from '../shared/exceptions/insufficient-permissions.exception';
import { InvalidCredentialsException } from '../shared/exceptions/invalid-credentials.exception';
import { NoDataProvidedException } from '../shared/exceptions/no-data.exception';
import { AdminUpdateUserRequestDto } from './dto/request/admin-update-user.request.dto';
import { UsersQueryDto } from './dto/request/query/users.query.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UsersService } from './users.service';

const roleUser = { id: 'r1', role: UserRoleEnum.USER };
const roleAdmin = { id: 'r2', role: UserRoleEnum.ADMIN };
const roleRoot = { id: 'r3', role: UserRoleEnum.ROOT_ADMIN };

function baseUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'u1',
    email: 'a@test.com',
    nickname: 'nick',
    password: 'hashed',
    isActive: true,
    createdAt: new Date(),
    roleId: roleUser.id,
    role: roleUser,
    registeredAuthor: [],
    ...overrides,
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let profilesService: { findOne: jest.Mock };
  let rolesService: {
    findByName: jest.Mock;
    findById: jest.Mock;
  };
  let fileService: { deleteFile: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    profilesService = { findOne: jest.fn() };
    rolesService = {
      findByName: jest.fn(),
      findById: jest.fn(),
    };
    fileService = { deleteFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProfilesService, useValue: profilesService },
        { provide: RolesService, useValue: rolesService },
        { provide: FileService, useValue: fileService },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('findOne', () => {
    it('throws EntityNotFoundException when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns UserDto without password by default', async () => {
      const row = baseUser();
      prisma.user.findUnique.mockResolvedValue(row);
      const result = await service.findOne('u1');
      expect(result).toMatchObject({
        id: 'u1',
        email: 'a@test.com',
        nickname: 'nick',
      });
      expect((result as { password?: string }).password).toBeUndefined();
    });

    it('returns UserWithPasswordDto when includePassword true', async () => {
      const row = baseUser();
      prisma.user.findUnique.mockResolvedValue(row);
      const result = await service.findOne('u1', true);
      expect(result).toMatchObject({ id: 'u1', password: 'hashed' });
    });
  });

  describe('findByEmail', () => {
    it('throws when not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.findByEmail('x@y.com')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns dto when found', async () => {
      prisma.user.findFirst.mockResolvedValue(baseUser());
      const result = await service.findByEmail('a@test.com');
      expect(result).toMatchObject({ id: 'u1', email: 'a@test.com' });
    });
  });

  describe('findUserDetails', () => {
    it('throws when not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findUserDetails('u1')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns UserDetailsDto when found', async () => {
      const row = {
        ...baseUser(),
        profile: {
          id: 'p1',
          avatar: '',
          coverImage: '',
          bio: null,
          points: 0,
          userId: 'u1',
          socialMedia: [],
        },
      };
      prisma.user.findUnique.mockResolvedValue(row);
      const result = await service.findUserDetails('u1');
      expect(result).toMatchObject({ id: 'u1' });
      expect(result.profile).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('applies search filter and returns meta + items', async () => {
      prisma.user.count.mockResolvedValue(1);
      prisma.user.findMany.mockResolvedValue([baseUser()]);
      const query = Object.assign(new UsersQueryDto(), {
        limit: 10,
        offset: 0,
        search: 'foo',
      });
      const result = await service.findAll(query);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { nickname: { contains: 'foo', mode: 'insensitive' } },
              { email: { contains: 'foo', mode: 'insensitive' } },
            ],
          },
          take: 10,
          skip: 0,
        }),
      );
      expect(result.meta.count).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('applies role filter when set', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.user.findMany.mockResolvedValue([]);
      const query = Object.assign(new UsersQueryDto(), {
        limit: 5,
        offset: 0,
        role: UserRoleEnum.ADMIN,
      });
      await service.findAll(query);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            role: {
              role: { equals: UserRoleEnum.ADMIN, mode: 'insensitive' },
            },
          },
        }),
      );
    });
  });

  describe('isUserExists', () => {
    it('throws DuplicateFieldException for duplicate email', async () => {
      prisma.user.findFirst.mockResolvedValue(
        baseUser({ email: 'Dup@mail.com', nickname: 'other' }),
      );
      await expect(
        service.isUserExists('dup@mail.com', 'unique'),
      ).rejects.toThrow(DuplicateFieldException);
    });

    it('throws DuplicateFieldException for duplicate nickname', async () => {
      prisma.user.findFirst.mockResolvedValue(
        baseUser({ email: 'other@test.com', nickname: 'SameNick' }),
      );
      await expect(
        service.isUserExists('unique@test.com', 'samenick'),
      ).rejects.toThrow(DuplicateFieldException);
    });

    it('resolves when no duplicate', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(
        service.isUserExists('new@test.com', 'newnick'),
      ).resolves.toBeUndefined();
    });
  });

  describe('update', () => {
    it('throws InvalidCredentialsException when password wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser());
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);
      const dto = Object.assign(new UpdateUserRequestDto(), {
        password: 'wrong',
      });
      await expect(service.update('u1', dto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('updates user when password valid', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser());
      prisma.user.findFirst.mockResolvedValue(null);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
      const updated = baseUser({ nickname: 'still' });
      prisma.user.update.mockResolvedValue(updated);
      const dto = Object.assign(new UpdateUserRequestDto(), {
        password: 'correct',
      });
      const result = await service.update('u1', dto);
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result.id).toBe('u1');
    });
  });

  describe('checkPermissions', () => {
    it('throws BadRequestException when editing self', async () => {
      await expect(
        service.checkPermissions(
          {
            id: 'u1',
            email: 'a@a.com',
            nickname: 'n',
            role: UserRoleEnum.ADMIN,
            isActive: true,
          },
          'u1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when target is ROOT_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(
        baseUser({ id: 'target', role: roleRoot }),
      );
      await expect(
        service.checkPermissions(
          {
            id: 'admin',
            email: 'a@a.com',
            nickname: 'n',
            role: UserRoleEnum.ADMIN,
            isActive: true,
          },
          'target',
        ),
      ).rejects.toThrow(InsufficientPermissionsException);
    });

    it('throws when admin edits admin', async () => {
      prisma.user.findUnique.mockResolvedValue(
        baseUser({ id: 'target', role: roleAdmin }),
      );
      await expect(
        service.checkPermissions(
          {
            id: 'admin',
            email: 'a@a.com',
            nickname: 'n',
            role: UserRoleEnum.ADMIN,
            isActive: true,
          },
          'target',
        ),
      ).rejects.toThrow(InsufficientPermissionsException);
    });
  });

  describe('activateUser', () => {
    it('throws ConflictException when already active', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser({ isActive: true }));
      await expect(service.activateUser('u1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('activates when inactive', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser({ isActive: false }));
      prisma.user.update.mockResolvedValue(baseUser({ isActive: true }));
      const result = await service.activateUser('u1');
      expect(result.isActive).toBe(true);
    });
  });

  describe('delete', () => {
    it('deletes user and skips file delete when no files', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser());
      profilesService.findOne.mockResolvedValue({
        avatar: '',
        coverImage: '',
      });
      prisma.user.delete.mockResolvedValue(baseUser());
      await service.delete('u1');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(fileService.deleteFile).not.toHaveBeenCalled();
    });

    it('deletes avatar and cover files when set', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser());
      profilesService.findOne.mockResolvedValue({
        avatar: 'av.png',
        coverImage: 'cv.png',
      });
      prisma.user.delete.mockResolvedValue(baseUser());
      await service.delete('u1');
      expect(fileService.deleteFile).toHaveBeenCalledWith('avatars/av.png');
      expect(fileService.deleteFile).toHaveBeenCalledWith('covers/cv.png');
    });
  });

  describe('adminUpdate', () => {
    const req = {
      user: {
        id: 'admin-id',
        email: 'admin@test.com',
        nickname: 'adm',
        role: UserRoleEnum.ROOT_ADMIN,
        isActive: true,
      },
    } as import('src/auth/types/authenticated-request.interface').IAuthenticatedRequest;

    it('throws NoDataProvidedException for empty dto', async () => {
      await expect(
        service.adminUpdate('target', {} as AdminUpdateUserRequestDto, req),
      ).rejects.toThrow(NoDataProvidedException);
    });

    it('throws InsufficientPermissionsException when non-root assigns ADMIN role', async () => {
      const adminReq = {
        user: {
          ...req.user,
          id: 'admin-id',
          role: UserRoleEnum.ADMIN,
        },
      } as import('src/auth/types/authenticated-request.interface').IAuthenticatedRequest;
      rolesService.findByName.mockResolvedValue(roleAdmin);
      jest.spyOn(service, 'checkPermissions').mockResolvedValue(undefined);
      prisma.user.findFirst.mockResolvedValue(null);
      rolesService.findById.mockResolvedValue({
        id: 'rid',
        role: UserRoleEnum.ADMIN,
      });
      const dto = Object.assign(new AdminUpdateUserRequestDto(), {
        roleId: 'rid',
      });
      await expect(
        service.adminUpdate('target-id', dto, adminReq),
      ).rejects.toThrow(InsufficientPermissionsException);
    });

    it('returns updated user details on success', async () => {
      rolesService.findByName.mockResolvedValue(roleRoot);
      jest.spyOn(service, 'checkPermissions').mockResolvedValue(undefined);
      prisma.user.findFirst.mockResolvedValue(null);
      const updated = {
        ...baseUser({ id: 'target-id' }),
        profile: null,
      };
      prisma.user.update.mockResolvedValue(updated);
      const dto = Object.assign(new AdminUpdateUserRequestDto(), {
        isActive: false,
      });
      const result = await service.adminUpdate('target-id', dto, req);
      expect(result.id).toBe('target-id');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
