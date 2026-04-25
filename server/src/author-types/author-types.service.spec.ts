import { Test, TestingModule } from '@nestjs/testing';
import { AuthorType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { AuthorTypesService } from './author-types.service';
import { AuthorTypesEnum } from './types/author-types.enum';

describe('AuthorTypesService', () => {
  let service: AuthorTypesService;
  let prisma: {
    authorType: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      authorType: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorTypesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthorTypesService);
  });

  const row: AuthorType = {
    id: 't1',
    type: AuthorTypesEnum.ARTIST,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.authorType.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.authorType.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns type', async () => {
      prisma.authorType.findUnique.mockResolvedValue(row);

      const out = await service.findOne('t1');

      expect(out).toEqual(row);
    });
  });

  describe('checkTypesExist', () => {
    it('returns true for empty', async () => {
      const out = await service.checkTypesExist([]);

      expect(out).toBe(true);
      expect(prisma.authorType.findMany).not.toHaveBeenCalled();
    });

    it('returns false when not all exist', async () => {
      prisma.authorType.findMany.mockResolvedValue([{ id: 'a' }]);

      const out = await service.checkTypesExist(['a', 'b']);

      expect(out).toBe(false);
    });

    it('returns true when all exist', async () => {
      prisma.authorType.findMany.mockResolvedValue([{ id: 'a' }, { id: 'b' }]);

      const out = await service.checkTypesExist(['a', 'b']);

      expect(out).toBe(true);
    });
  });

  describe('findByType', () => {
    it('returns null when missing', async () => {
      prisma.authorType.findFirst.mockResolvedValue(null);

      const out = await service.findByType(AuthorTypesEnum.ARTIST);

      expect(out).toBeNull();
    });

    it('returns type when found', async () => {
      prisma.authorType.findFirst.mockResolvedValue(row);

      const out = await service.findByType(AuthorTypesEnum.ARTIST);

      expect(out).toEqual(row);
    });
  });
});
