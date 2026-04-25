import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from 'src/authors/authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { DuplicateFieldException } from 'src/shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewRequestDto } from './dto/request/create-review.request.dto';
import { ReviewsQueryDto } from './dto/request/query/reviews.query.dto';
import { UpdateReviewRequestDto } from './dto/request/update-review.request.dto';
import { ReviewDto } from './dto/response/review.dto';
import { ReviewsService } from './reviews.service';

function mockReviewRow(id: string, userId: string, releaseId: string) {
  return {
    id,
    userId,
    releaseId,
    rhymes: 5,
    structure: 5,
    realization: 5,
    individuality: 5,
    atmosphere: 5,
    total: 36,
    title: null as string | null,
    text: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function mockReviewDto(id: string): ReviewDto {
  return {
    id,
    title: null,
    text: '',
    values: {
      total: 36,
      rhymes: 5,
      structure: 5,
      realization: 5,
      individuality: 5,
      atmosphere: 5,
    },
    user: {
      id: 'u1',
      nickname: 'n',
      avatar: '',
      points: 0,
      rank: null,
    },
    release: { id: 'rel1', title: 'T', img: '' },
    userFavReview: [],
    authorFavReview: [],
    createdAt: '2020-01-01T00:00:00.000Z',
  };
}

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    review: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $queryRaw: jest.Mock;
  };
  let usersService: { findOne: jest.Mock };
  let releasesService: { findOne: jest.Mock };
  let authorsService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      review: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };
    usersService = { findOne: jest.fn() };
    releasesService = { findOne: jest.fn() };
    authorsService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: ReleasesService, useValue: releasesService },
        { provide: AuthorsService, useValue: authorsService },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  describe('findOne', () => {
    it('throws EntityNotFoundException when missing', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns review when found', async () => {
      const row = mockReviewRow('r1', 'u1', 'rel1');
      prisma.review.findUnique.mockResolvedValue(row);
      await expect(service.findOne('r1')).resolves.toEqual(row);
    });
  });

  describe('findById', () => {
    it('throws when items empty', async () => {
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [], meta: { count: 0 } } },
      ]);
      await expect(service.findById('r1')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns dto when found', async () => {
      const dto = mockReviewDto('r1');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [dto], meta: { count: 1 } } },
      ]);
      await expect(service.findById('r1')).resolves.toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('returns result from raw query', async () => {
      const payload = { items: [mockReviewDto('r1')], meta: { count: 1 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      await expect(service.findAll(new ReviewsQueryDto())).resolves.toEqual(
        payload,
      );
    });

    it('validates favUserId when set', async () => {
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      const payload = { items: [], meta: { count: 0 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const q = Object.assign(new ReviewsQueryDto(), { favUserId: 'u1' });
      await expect(service.findAll(q)).resolves.toEqual(payload);
      expect(usersService.findOne).toHaveBeenCalledWith('u1');
    });

    it('validates authorId when set', async () => {
      authorsService.findOne.mockResolvedValue({ id: 'a1' });
      const payload = { items: [], meta: { count: 0 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const q = Object.assign(new ReviewsQueryDto(), { authorId: 'a1' });
      await expect(service.findAll(q)).resolves.toEqual(payload);
      expect(authorsService.findOne).toHaveBeenCalledWith('a1');
    });
  });

  describe('create', () => {
    const dto = Object.assign(new CreateReviewRequestDto(), {
      rhymes: 5,
      structure: 5,
      realization: 5,
      individuality: 5,
      atmosphere: 5,
      releaseId: 'rel1',
    });

    it('throws DuplicateFieldException when review exists', async () => {
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      releasesService.findOne.mockResolvedValue({ id: 'rel1' });
      prisma.review.findUnique.mockResolvedValue(
        mockReviewRow('ex', 'u1', 'rel1'),
      );
      await expect(service.create(dto, 'u1')).rejects.toThrow(
        DuplicateFieldException,
      );
    });

    it('creates and returns findById', async () => {
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      releasesService.findOne.mockResolvedValue({ id: 'rel1' });
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 'new-rev' });
      const out = mockReviewDto('new-rev');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [out], meta: { count: 1 } } },
      ]);
      const result = await service.create(dto, 'u1');
      expect(result).toEqual(out);
      expect(prisma.review.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('throws InsufficientPermissionsException when not owner', async () => {
      prisma.review.findUnique.mockResolvedValue(
        mockReviewRow('rev1', 'owner', 'rel1'),
      );
      const dto = Object.assign(new UpdateReviewRequestDto(), {
        atmosphere: 6,
      });
      await expect(service.update('rev1', dto, 'other')).rejects.toThrow(
        InsufficientPermissionsException,
      );
    });

    it('updates as owner and returns findById', async () => {
      const row = mockReviewRow('rev1', 'u1', 'rel1');
      prisma.review.findUnique.mockResolvedValue(row);
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      prisma.review.update.mockResolvedValue({ id: 'rev1' });
      const out = mockReviewDto('rev1');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [out], meta: { count: 1 } } },
      ]);
      const dto = Object.assign(new UpdateReviewRequestDto(), {
        atmosphere: 6,
      });
      const result = await service.update('rev1', dto, 'u1');
      expect(result).toEqual(out);
    });

    it('admin update without userId uses findOne only', async () => {
      prisma.review.findUnique.mockResolvedValue(
        mockReviewRow('rev1', 'u1', 'rel1'),
      );
      prisma.review.update.mockResolvedValue({ id: 'rev1' });
      const out = mockReviewDto('rev1');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [out], meta: { count: 1 } } },
      ]);
      const dto = Object.assign(new UpdateReviewRequestDto(), {
        atmosphere: 7,
      });
      const result = await service.update('rev1', dto);
      expect(result).toEqual(out);
    });
  });

  describe('remove', () => {
    it('throws when not owner', async () => {
      prisma.review.findUnique.mockResolvedValue(
        mockReviewRow('rev1', 'owner', 'rel1'),
      );
      await expect(service.remove('rev1', 'other')).rejects.toThrow(
        InsufficientPermissionsException,
      );
    });

    it('deletes when owner', async () => {
      prisma.review.findUnique.mockResolvedValue(
        mockReviewRow('rev1', 'u1', 'rel1'),
      );
      prisma.review.delete.mockResolvedValue({});
      await expect(service.remove('rev1', 'u1')).resolves.toBeUndefined();
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: 'rev1' },
      });
    });

    it('admin delete skips ownership', async () => {
      prisma.review.delete.mockResolvedValue({});
      await expect(service.remove('rev1')).resolves.toBeUndefined();
      expect(prisma.review.findUnique).not.toHaveBeenCalled();
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: 'rev1' },
      });
    });
  });
});
