import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { ReleaseTypesService } from './release-types.service';
import { ReleaseTypesEnum } from './types/release-types.enum';

describe('ReleaseTypesService', () => {
  let service: ReleaseTypesService;
  let prisma: {
    releaseType: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      releaseType: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleaseTypesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReleaseTypesService);
  });

  const row: ReleaseType = {
    id: 'rt1',
    type: ReleaseTypesEnum.ALBUM,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.releaseType.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.releaseType.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns type', async () => {
      prisma.releaseType.findUnique.mockResolvedValue(row);

      const out = await service.findOne('rt1');

      expect(out).toEqual(row);
    });
  });

  describe('findByType', () => {
    it('returns null when missing', async () => {
      prisma.releaseType.findFirst.mockResolvedValue(null);

      const out = await service.findByType(ReleaseTypesEnum.SINGLE);

      expect(out).toBeNull();
    });

    it('returns when found', async () => {
      prisma.releaseType.findFirst.mockResolvedValue(row);

      const out = await service.findByType('альбом');

      expect(out).toEqual(row);
    });
  });
});
