import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseMediaStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { ReleaseMediaStatusesService } from './release-media-statuses.service';
import { ReleaseMediaStatusesEnum } from './types/release-media-statuses.enum';

describe('ReleaseMediaStatusesService', () => {
  let service: ReleaseMediaStatusesService;
  let prisma: {
    releaseMediaStatus: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      releaseMediaStatus: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleaseMediaStatusesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReleaseMediaStatusesService);
  });

  const row: ReleaseMediaStatus = {
    id: 's1',
    status: ReleaseMediaStatusesEnum.APPROVED,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.releaseMediaStatus.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findById', () => {
    it('throws when missing', async () => {
      prisma.releaseMediaStatus.findUnique.mockResolvedValue(null);

      await expect(service.findById('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns status', async () => {
      prisma.releaseMediaStatus.findUnique.mockResolvedValue(row);

      const out = await service.findById('s1');

      expect(out).toEqual(row);
    });
  });

  describe('findByStatus', () => {
    it('throws when missing', async () => {
      prisma.releaseMediaStatus.findFirst.mockResolvedValue(null);

      await expect(service.findByStatus('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns by partial case-insensitive match', async () => {
      prisma.releaseMediaStatus.findFirst.mockResolvedValue(row);

      const out = await service.findByStatus('Прин');

      expect(out).toEqual(row);
    });
  });
});
