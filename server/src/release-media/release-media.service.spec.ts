import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesService } from 'src/release-media-statuses/release-media-statuses.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesService } from 'src/release-media-types/release-media-types.service';
import { ReleasesService } from 'src/releases/releases.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { UsersService } from 'src/users/users.service';
import { CreateReleaseMediaDto } from './dto/create-release-media.dto';
import { ReleaseMediaDto } from './dto/response/release-media.dto';
import { UpdateReleaseMediaDto } from './dto/update-release-media.dto';
import { ReleaseMediaService } from './release-media.service';

function rawQueryResult(items: unknown[], count: number) {
  return [{ result: { items, meta: { count } } }];
}

const mockMediaDto: ReleaseMediaDto = {
  id: 'm1',
  title: 'T',
  url: 'https://example.com/v',
  status: { id: 'st', status: 'Принято' } as never,
  type: { id: 'ty', type: 'Медиарецензия' } as never,
  user: null,
  release: { id: 'r1', title: 'Rel', img: '' },
  review: null,
  userFavMedia: [],
  authorFavMedia: [],
  createdAt: new Date().toISOString(),
};

describe('ReleaseMediaService', () => {
  let service: ReleaseMediaService;
  let prisma: {
    releaseMedia: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    review: { findUnique: jest.Mock };
    $queryRaw: jest.Mock;
  };
  let releasesService: { findOne: jest.Mock };
  let usersService: { findOne: jest.Mock };
  let reviewsService: { findOne: jest.Mock };
  let releaseMediaStatusesService: {
    findById: jest.Mock;
    findByStatus: jest.Mock;
  };
  let releaseMediaTypesService: { findById: jest.Mock };

  beforeEach(async () => {
    prisma = {
      releaseMedia: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      review: { findUnique: jest.fn() },
      $queryRaw: jest.fn(),
    };
    releasesService = { findOne: jest.fn() };
    usersService = { findOne: jest.fn() };
    reviewsService = { findOne: jest.fn() };
    releaseMediaStatusesService = {
      findById: jest.fn(),
      findByStatus: jest.fn(),
    };
    releaseMediaTypesService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleaseMediaService,
        { provide: PrismaService, useValue: prisma },
        { provide: ReleasesService, useValue: releasesService },
        { provide: UsersService, useValue: usersService },
        { provide: ReviewsService, useValue: reviewsService },
        {
          provide: ReleaseMediaStatusesService,
          useValue: releaseMediaStatusesService,
        },
        {
          provide: ReleaseMediaTypesService,
          useValue: releaseMediaTypesService,
        },
      ],
    }).compile();

    service = module.get(ReleaseMediaService);
  });

  const mediaEntity = {
    id: 'm1',
    userId: 'u1',
    releaseId: 'rel1',
    reviewId: 'rev1',
    title: 'T',
    url: 'https://u.com',
  };

  describe('create', () => {
    it('creates without userId and returns dto from raw query', async () => {
      const dto: CreateReleaseMediaDto = {
        title: 'T',
        url: 'https://new.example/watch',
        releaseId: 'rel1',
        releaseMediaTypeId: 't1',
        releaseMediaStatusId: 's1',
      } as CreateReleaseMediaDto;
      releasesService.findOne.mockResolvedValue({ id: 'rel1' });
      prisma.releaseMedia.count.mockResolvedValue(0);
      prisma.releaseMedia.create.mockResolvedValue({ id: 'm1' });
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([mockMediaDto], 1));

      const out = await service.create(dto);

      expect(out).toEqual(mockMediaDto);
      expect(prisma.review.findUnique).not.toHaveBeenCalled();
    });

    it('throws Conflict when url exists', async () => {
      const dto: CreateReleaseMediaDto = {
        title: 'T',
        url: 'https://dup.com',
        releaseId: 'rel1',
        releaseMediaTypeId: 't1',
        releaseMediaStatusId: 's1',
      } as CreateReleaseMediaDto;
      releasesService.findOne.mockResolvedValue({});
      prisma.releaseMedia.count.mockResolvedValue(1);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws when user already has media on release', async () => {
      const dto: CreateReleaseMediaDto = {
        title: 'T',
        url: 'https://n.com',
        releaseId: 'rel1',
        releaseMediaTypeId: 't1',
        releaseMediaStatusId: 's1',
        userId: 'u1',
      } as CreateReleaseMediaDto;
      releasesService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.releaseMedia.count.mockResolvedValueOnce(1);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws BadRequest when user has no review for release', async () => {
      const dto: CreateReleaseMediaDto = {
        title: 'T',
        url: 'https://n.com',
        releaseId: 'rel1',
        releaseMediaTypeId: 't1',
        releaseMediaStatusId: 's1',
        userId: 'u1',
      } as CreateReleaseMediaDto;
      releasesService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.releaseMedia.count.mockResolvedValueOnce(0);
      prisma.review.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.releaseMedia.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('throws when raw query has no items', async () => {
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([], 0));

      await expect(service.findById('m1')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns first item', async () => {
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([mockMediaDto], 1));

      const out = await service.findById('m1');

      expect(out).toEqual(mockMediaDto);
    });
  });

  describe('findAll', () => {
    it('returns result from raw query', async () => {
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([mockMediaDto], 1));

      const out = await service.findAll({ limit: 10, offset: 0 });

      expect(out.items).toEqual([mockMediaDto]);
      expect(out.meta.count).toBe(1);
    });
  });

  describe('update', () => {
    it('throws NoDataProvided when empty', async () => {
      await expect(
        service.update('m1', {} as UpdateReleaseMediaDto),
      ).rejects.toBeInstanceOf(NoDataProvidedException);
    });

    it('throws when not owner and userId provided', async () => {
      prisma.releaseMedia.findUnique.mockResolvedValue({
        ...mediaEntity,
        userId: 'u1',
        releaseMediaStatus: { id: 's' },
        releaseMediaType: { id: 't' },
      });

      await expect(
        service.update('m1', { title: 'New' } as UpdateReleaseMediaDto, 'u2'),
      ).rejects.toBeInstanceOf(InsufficientPermissionsException);
    });

    it('applies PENDING when user updates own media', async () => {
      const pending = {
        id: 'st-pen',
        status: ReleaseMediaStatusesEnum.PENDING,
      };
      prisma.releaseMedia.findUnique.mockResolvedValue({
        ...mediaEntity,
        userId: 'u1',
        releaseMediaStatus: { id: 's0' },
        releaseMediaType: { id: 't0' },
      });
      releaseMediaStatusesService.findByStatus.mockResolvedValue(pending);
      prisma.releaseMedia.update.mockResolvedValue({ id: 'm1' });
      prisma.$queryRaw.mockResolvedValue(
        rawQueryResult(
          [
            {
              ...mockMediaDto,
              status: { id: pending.id, status: pending.status } as never,
            },
          ],
          1,
        ),
      );

      const out = await service.update(
        'm1',
        { title: 'N' } as UpdateReleaseMediaDto,
        'u1',
      );

      expect(out.id).toBe('m1');
      expect(releaseMediaStatusesService.findByStatus).toHaveBeenCalledWith(
        ReleaseMediaStatusesEnum.PENDING,
      );
    });
  });

  describe('remove', () => {
    it('throws when user is not owner', async () => {
      prisma.releaseMedia.findUnique.mockResolvedValue({
        ...mediaEntity,
        userId: 'u1',
        releaseMediaStatus: { id: 's' },
        releaseMediaType: { id: 't' },
      });

      await expect(service.remove('m1', 'u2')).rejects.toBeInstanceOf(
        InsufficientPermissionsException,
      );
    });

    it('deletes when owner', async () => {
      prisma.releaseMedia.findUnique.mockResolvedValue({
        ...mediaEntity,
        userId: 'u1',
        releaseMediaStatus: { id: 's' },
        releaseMediaType: { id: 't' },
      });
      prisma.releaseMedia.delete.mockResolvedValue({});

      await service.remove('m1', 'u1');

      expect(prisma.releaseMedia.delete).toHaveBeenCalledWith({
        where: { id: 'm1' },
      });
    });
  });
});
