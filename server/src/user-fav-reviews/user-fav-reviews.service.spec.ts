import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFavReview } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { UserFavReviewsService } from './user-fav-reviews.service';

describe('UserFavReviewsService', () => {
  let service: UserFavReviewsService;
  let prisma: {
    userFavReview: {
      create: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    $queryRaw: jest.Mock;
  };
  let usersService: { findOne: jest.Mock };
  let reviewsService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      userFavReview: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };
    usersService = { findOne: jest.fn() };
    reviewsService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFavReviewsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: ReviewsService, useValue: reviewsService },
      ],
    }).compile();

    service = module.get(UserFavReviewsService);
  });

  const review = {
    id: 'rev1',
    userId: 'author',
    title: 'T',
    text: 'body',
    releaseId: 'r1',
    rhymes: 5,
    structure: 5,
    realization: 5,
    individuality: 5,
    atmosphere: 5,
    total: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const favRow: UserFavReview = {
    userId: 'u1',
    reviewId: 'rev1',
    createdAt: new Date(),
  };

  describe('create', () => {
    it('throws when favoriting own review', async () => {
      usersService.findOne.mockResolvedValue({});
      reviewsService.findOne.mockResolvedValue({ ...review, userId: 'u1' });

      await expect(service.create('rev1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws when review has no title or text', async () => {
      usersService.findOne.mockResolvedValue({});
      reviewsService.findOne.mockResolvedValue({
        ...review,
        title: null,
        text: 'x',
      });

      await expect(service.create('rev1', 'u1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('throws when duplicate', async () => {
      usersService.findOne.mockResolvedValue({});
      reviewsService.findOne.mockResolvedValue(review);
      prisma.userFavReview.findUnique.mockResolvedValue(favRow);

      await expect(service.create('rev1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('creates favorite', async () => {
      usersService.findOne.mockResolvedValue({});
      reviewsService.findOne.mockResolvedValue(review);
      prisma.userFavReview.findUnique.mockResolvedValue(null);
      prisma.userFavReview.create.mockResolvedValue(favRow);

      const out = await service.create('rev1', 'u1');

      expect(out).toEqual(favRow);
    });
  });

  describe('remove', () => {
    it('throws when not favorited', async () => {
      reviewsService.findOne.mockResolvedValue(review);
      usersService.findOne.mockResolvedValue({});
      prisma.userFavReview.findUnique.mockResolvedValue(null);

      await expect(service.remove('rev1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('deletes favorite', async () => {
      reviewsService.findOne.mockResolvedValue(review);
      usersService.findOne.mockResolvedValue({});
      prisma.userFavReview.findUnique.mockResolvedValue(favRow);
      prisma.userFavReview.delete.mockResolvedValue(favRow);

      await service.remove('rev1', 'u1');

      expect(prisma.userFavReview.delete).toHaveBeenCalledWith({
        where: { userId_reviewId: { userId: 'u1', reviewId: 'rev1' } },
      });
    });
  });

  describe('findAuthorLikes', () => {
    it('returns raw query result', async () => {
      const payload = { items: [], meta: { count: 0 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);

      const out = await service.findAuthorLikes({ limit: 10, offset: 0 });

      expect(out).toEqual(payload);
    });
  });
});
