import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFavRelease } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import { UserFavReleasesService } from './user-fav-releases.service';

describe('UserFavReleasesService', () => {
  let service: UserFavReleasesService;
  let prisma: {
    userFavRelease: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };
  let usersService: { findOne: jest.Mock };
  let releasesService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      userFavRelease: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    usersService = { findOne: jest.fn() };
    releasesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFavReleasesService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: ReleasesService, useValue: releasesService },
      ],
    }).compile();

    service = module.get(UserFavReleasesService);
  });

  const row: UserFavRelease = {
    userId: 'u1',
    releaseId: 'r1',
    createdAt: new Date(),
  };

  describe('create', () => {
    it('throws when already favorited', async () => {
      usersService.findOne.mockResolvedValue({});
      releasesService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findUnique.mockResolvedValue(row);

      await expect(service.create('r1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('creates favorite', async () => {
      usersService.findOne.mockResolvedValue({});
      releasesService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findUnique.mockResolvedValue(null);
      prisma.userFavRelease.create.mockResolvedValue(row);

      const out = await service.create('r1', 'u1');

      expect(out).toEqual(row);
    });
  });

  describe('findByUserId', () => {
    it('returns list', async () => {
      usersService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findMany.mockResolvedValue([row]);

      expect(await service.findByUserId('u1')).toEqual([row]);
    });
  });

  describe('findByReleaseId', () => {
    it('returns list', async () => {
      releasesService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findMany.mockResolvedValue([row]);

      expect(await service.findByReleaseId('r1')).toEqual([row]);
    });
  });

  describe('remove', () => {
    it('throws when not favorited', async () => {
      releasesService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findUnique.mockResolvedValue(null);

      await expect(service.remove('r1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('deletes favorite', async () => {
      releasesService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.userFavRelease.findUnique.mockResolvedValue(row);
      prisma.userFavRelease.delete.mockResolvedValue(row);

      await expect(service.remove('r1', 'u1')).resolves.toEqual(row);
    });
  });
});
