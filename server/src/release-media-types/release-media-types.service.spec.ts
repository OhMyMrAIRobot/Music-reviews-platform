import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseMediaType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { ReleaseMediaTypesService } from './release-media-types.service';
import { ReleaseMediaTypesEnum } from './types/release-media-types.enum';

describe('ReleaseMediaTypesService', () => {
  let service: ReleaseMediaTypesService;
  let prisma: {
    releaseMediaType: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      releaseMediaType: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleaseMediaTypesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReleaseMediaTypesService);
  });

  const row: ReleaseMediaType = {
    id: 't1',
    type: ReleaseMediaTypesEnum.MEDIA_REVIEW,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.releaseMediaType.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findById', () => {
    it('throws when missing', async () => {
      prisma.releaseMediaType.findUnique.mockResolvedValue(null);

      await expect(service.findById('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns type', async () => {
      prisma.releaseMediaType.findUnique.mockResolvedValue(row);

      const out = await service.findById('t1');

      expect(out).toEqual(row);
    });
  });

  describe('findByType', () => {
    it('throws when missing', async () => {
      prisma.releaseMediaType.findFirst.mockResolvedValue(null);

      await expect(service.findByType('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns by partial match', async () => {
      prisma.releaseMediaType.findFirst.mockResolvedValue(row);

      const out = await service.findByType('Медиа');

      expect(out).toEqual(row);
    });
  });
});
