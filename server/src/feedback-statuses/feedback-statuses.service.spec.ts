import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { FeedbackStatusesService } from './feedback-statuses.service';
import { FeedbackStatusesEnum } from './types/feedback-statuses.enum';

describe('FeedbackStatusesService', () => {
  let service: FeedbackStatusesService;
  let prisma: {
    feedbackStatus: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      feedbackStatus: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackStatusesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(FeedbackStatusesService);
  });

  const row: FeedbackStatus = {
    id: 'fs1',
    status: FeedbackStatusesEnum.NEW,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.feedbackStatus.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.feedbackStatus.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns status', async () => {
      prisma.feedbackStatus.findUnique.mockResolvedValue(row);

      const out = await service.findOne('fs1');

      expect(out).toEqual(row);
    });
  });

  describe('findByStatus', () => {
    it('returns null when missing', async () => {
      prisma.feedbackStatus.findFirst.mockResolvedValue(null);

      const out = await service.findByStatus(FeedbackStatusesEnum.NEW);

      expect(out).toBeNull();
    });

    it('returns row when found', async () => {
      prisma.feedbackStatus.findFirst.mockResolvedValue(row);

      const out = await service.findByStatus('новое');

      expect(out).toEqual(row);
    });
  });
});
