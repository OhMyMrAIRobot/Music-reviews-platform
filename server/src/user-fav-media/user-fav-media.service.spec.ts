import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFavMedia } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/types/release-media-types.enum';
import { ReleaseMediaService } from 'src/release-media/release-media.service';
import { UsersService } from 'src/users/users.service';
import { UserFavMediaService } from './user-fav-media.service';

function approvedMediaReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'm1',
    userId: 'owner',
    releaseMediaStatus: { status: ReleaseMediaStatusesEnum.APPROVED },
    releaseMediaType: { type: ReleaseMediaTypesEnum.MEDIA_REVIEW },
    ...overrides,
  };
}

describe('UserFavMediaService', () => {
  let service: UserFavMediaService;
  let prisma: {
    userFavMedia: {
      create: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };
  let usersService: { findOne: jest.Mock };
  let releaseMediaService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      userFavMedia: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    usersService = { findOne: jest.fn() };
    releaseMediaService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFavMediaService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: ReleaseMediaService, useValue: releaseMediaService },
      ],
    }).compile();

    service = module.get(UserFavMediaService);
  });

  const favRow: UserFavMedia = {
    userId: 'u1',
    mediaId: 'm1',
    createdAt: new Date(),
  };

  describe('create', () => {
    it('throws when user owns media', async () => {
      usersService.findOne.mockResolvedValue({});
      releaseMediaService.findOne.mockResolvedValue(
        approvedMediaReview({ userId: 'u1' }),
      );

      await expect(service.create('m1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws when media is not approved media review', async () => {
      usersService.findOne.mockResolvedValue({});
      releaseMediaService.findOne.mockResolvedValue(
        approvedMediaReview({
          releaseMediaStatus: { status: ReleaseMediaStatusesEnum.PENDING },
        }),
      );

      await expect(service.create('m1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws when already favorited', async () => {
      usersService.findOne.mockResolvedValue({});
      releaseMediaService.findOne.mockResolvedValue(approvedMediaReview());
      prisma.userFavMedia.findUnique.mockResolvedValue(favRow);

      await expect(service.create('m1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('creates favorite', async () => {
      usersService.findOne.mockResolvedValue({});
      releaseMediaService.findOne.mockResolvedValue(approvedMediaReview());
      prisma.userFavMedia.findUnique.mockResolvedValue(null);
      prisma.userFavMedia.create.mockResolvedValue(favRow);

      const out = await service.create('m1', 'u1');

      expect(out).toEqual(favRow);
    });
  });

  describe('remove', () => {
    it('throws when not favorited', async () => {
      releaseMediaService.findOne.mockResolvedValue(approvedMediaReview());
      usersService.findOne.mockResolvedValue({});
      prisma.userFavMedia.findUnique.mockResolvedValue(null);

      await expect(service.remove('m1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('deletes favorite', async () => {
      releaseMediaService.findOne.mockResolvedValue(approvedMediaReview());
      usersService.findOne.mockResolvedValue({});
      prisma.userFavMedia.findUnique.mockResolvedValue(favRow);
      prisma.userFavMedia.delete.mockResolvedValue(favRow);

      await expect(service.remove('m1', 'u1')).resolves.toEqual(favRow);
    });
  });
});
