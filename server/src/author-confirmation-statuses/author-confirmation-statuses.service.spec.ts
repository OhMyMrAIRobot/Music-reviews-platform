import { Test, TestingModule } from '@nestjs/testing';
import { AuthorConfirmationStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { AuthorConfirmationStatusesService } from './author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from './types/author-confirmation-statuses.enum';

describe('AuthorConfirmationStatusesService', () => {
  let service: AuthorConfirmationStatusesService;
  let prisma: {
    authorConfirmationStatus: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      authorConfirmationStatus: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorConfirmationStatusesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthorConfirmationStatusesService);
  });

  const row: AuthorConfirmationStatus = {
    id: 's1',
    status: AuthorConfirmationStatusesEnum.PENDING,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.authorConfirmationStatus.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.authorConfirmationStatus.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns status', async () => {
      prisma.authorConfirmationStatus.findUnique.mockResolvedValue(row);

      const out = await service.findOne('s1');

      expect(out).toEqual(row);
    });
  });

  describe('findByStatus', () => {
    it('throws when missing', async () => {
      prisma.authorConfirmationStatus.findFirst.mockResolvedValue(null);

      await expect(
        service.findByStatus(AuthorConfirmationStatusesEnum.PENDING),
      ).rejects.toBeInstanceOf(EntityNotFoundException);
    });

    it('returns by case-insensitive match', async () => {
      prisma.authorConfirmationStatus.findFirst.mockResolvedValue(row);

      const out = await service.findByStatus('ожидание');

      expect(out).toEqual(row);
      expect(prisma.authorConfirmationStatus.findFirst).toHaveBeenCalledWith({
        where: { status: { equals: 'ожидание', mode: 'insensitive' } },
      });
    });
  });
});
