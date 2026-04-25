import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFavAuthor } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { UsersService } from 'src/users/users.service';
import { UserFavAuthorsService } from './user-fav-authors.service';

describe('UserFavAuthorsService', () => {
  let service: UserFavAuthorsService;
  let prisma: {
    userFavAuthor: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };
  let usersService: { findOne: jest.Mock };
  let authorsService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      userFavAuthor: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    usersService = { findOne: jest.fn() };
    authorsService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFavAuthorsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: AuthorsService, useValue: authorsService },
      ],
    }).compile();

    service = module.get(UserFavAuthorsService);
  });

  const row: UserFavAuthor = {
    userId: 'u1',
    authorId: 'a1',
    createdAt: new Date(),
  };

  describe('create', () => {
    it('throws when already favorited', async () => {
      usersService.findOne.mockResolvedValue({});
      authorsService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findUnique.mockResolvedValue(row);

      await expect(service.create('a1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.userFavAuthor.create).not.toHaveBeenCalled();
    });

    it('creates favorite', async () => {
      usersService.findOne.mockResolvedValue({});
      authorsService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findUnique.mockResolvedValue(null);
      prisma.userFavAuthor.create.mockResolvedValue(row);

      const out = await service.create('a1', 'u1');

      expect(out).toEqual(row);
      expect(prisma.userFavAuthor.create).toHaveBeenCalledWith({
        data: { authorId: 'a1', userId: 'u1' },
      });
    });
  });

  describe('findByUserId', () => {
    it('returns list', async () => {
      usersService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findMany.mockResolvedValue([row]);

      const out = await service.findByUserId('u1');

      expect(out).toEqual([row]);
    });
  });

  describe('findByAuthorId', () => {
    it('returns list', async () => {
      authorsService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findMany.mockResolvedValue([row]);

      const out = await service.findByAuthorId('a1');

      expect(out).toEqual([row]);
    });
  });

  describe('remove', () => {
    it('throws when not favorited', async () => {
      authorsService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findUnique.mockResolvedValue(null);

      await expect(service.remove('a1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('deletes favorite', async () => {
      authorsService.findOne.mockResolvedValue({});
      usersService.findOne.mockResolvedValue({});
      prisma.userFavAuthor.findUnique.mockResolvedValue(row);
      prisma.userFavAuthor.delete.mockResolvedValue(row);

      const out = await service.remove('a1', 'u1');

      expect(out).toEqual(row);
      expect(prisma.userFavAuthor.delete).toHaveBeenCalledWith({
        where: { userId_authorId: { userId: 'u1', authorId: 'a1' } },
      });
    });
  });
});
