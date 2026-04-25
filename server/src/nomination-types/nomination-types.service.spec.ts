import { Test, TestingModule } from '@nestjs/testing';
import { NominationType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { NominationTypesService } from './nomination-types.service';
import { NominationTypesEnum } from './types/nomination-types.enum';

describe('NominationTypesService', () => {
  let service: NominationTypesService;
  let prisma: {
    nominationType: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      nominationType: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NominationTypesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(NominationTypesService);
  });

  const row: NominationType = {
    id: 'n1',
    type: NominationTypesEnum.ARTIST_OF_MONTH,
  };

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.nominationType.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns type', async () => {
      prisma.nominationType.findUnique.mockResolvedValue(row);

      const out = await service.findOne('n1');

      expect(out).toEqual(row);
    });
  });

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.nominationType.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });
});
