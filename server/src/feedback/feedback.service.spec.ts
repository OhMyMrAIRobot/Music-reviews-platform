import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackRepliesService } from 'src/feedback-replies/feedback-replies.service';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { CreateFeedbackRequestDto } from './dto/request/create-feedback.request.dto';
import { UpdateFeedbackRequestDto } from './dto/request/update-feedback.request.dto';
import { FeedbackDto } from './dto/response/feedback.dto';
import { FeedbackService } from './feedback.service';

function feedbackRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'f1',
    email: 'a@b.com',
    title: 'Title',
    message: 'm'.repeat(100),
    createdAt: new Date('2020-01-01'),
    feedbackStatusId: 'st1',
    feedbackStatus: { id: 'st1', status: FeedbackStatusesEnum.NEW },
    ...overrides,
  };
}

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: {
    feedback: {
      create: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let statusesService: { findByStatus: jest.Mock; findOne: jest.Mock };
  let feedbackRepliesService: { findByFeedbackId: jest.Mock };

  beforeEach(async () => {
    prisma = {
      feedback: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    statusesService = { findByStatus: jest.fn(), findOne: jest.fn() };
    feedbackRepliesService = { findByFeedbackId: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: PrismaService, useValue: prisma },
        { provide: FeedbackStatusesService, useValue: statusesService },
        {
          provide: FeedbackRepliesService,
          useValue: feedbackRepliesService,
        },
      ],
    }).compile();

    service = module.get(FeedbackService);
  });

  describe('create', () => {
    const dto = {
      email: 'a@b.com',
      title: 'Title',
      message: 'm'.repeat(100),
    } as CreateFeedbackRequestDto;

    it('throws when status is missing', async () => {
      statusesService.findByStatus.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
      expect(prisma.feedback.create).not.toHaveBeenCalled();
    });

    it('creates with NEW status id', async () => {
      statusesService.findByStatus.mockResolvedValue({ id: 'st-new' });
      const created = feedbackRow({ feedbackStatusId: 'st-new' });
      prisma.feedback.create.mockResolvedValue(created);

      const out = await service.create(dto);

      expect(prisma.feedback.create).toHaveBeenCalledWith({
        data: { ...dto, feedbackStatusId: 'st-new' },
      });
      expect(out).toBeInstanceOf(FeedbackDto);
      expect(out.id).toBe('f1');
    });
  });

  describe('findAll', () => {
    it('validates statusId when set', async () => {
      statusesService.findOne.mockResolvedValue({ id: 'st1' });
      prisma.feedback.count.mockResolvedValue(0);
      prisma.feedback.findMany.mockResolvedValue([]);

      await service.findAll({ statusId: 'st1', offset: 0 });

      expect(statusesService.findOne).toHaveBeenCalledWith('st1');
    });

    it('returns meta and items', async () => {
      prisma.feedback.count.mockResolvedValue(1);
      prisma.feedback.findMany.mockResolvedValue([feedbackRow()]);

      const out = await service.findAll({ limit: 10, offset: 0 });

      expect(out.meta.count).toBe(1);
      expect(out.items).toHaveLength(1);
      expect(out.items[0]).toBeInstanceOf(FeedbackDto);
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.feedback.findUnique.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns dto', async () => {
      prisma.feedback.findUnique.mockResolvedValue(feedbackRow());

      const out = await service.findOne('f1');

      expect(out.id).toBe('f1');
    });
  });

  describe('update', () => {
    it('throws Conflict when ANSWERED without reply', async () => {
      prisma.feedback.findUnique.mockResolvedValue(feedbackRow());
      statusesService.findOne.mockResolvedValue({
        id: 'st-ans',
        status: FeedbackStatusesEnum.ANSWERED,
      });
      feedbackRepliesService.findByFeedbackId.mockResolvedValue(null);

      await expect(
        service.update('f1', {
          feedbackStatusId: 'st-ans',
        } as UpdateFeedbackRequestDto),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.feedback.update).not.toHaveBeenCalled();
    });

    it('updates when ANSWERED and reply exists', async () => {
      prisma.feedback.findUnique.mockResolvedValue(feedbackRow());
      statusesService.findOne.mockResolvedValue({
        id: 'st-ans',
        status: FeedbackStatusesEnum.ANSWERED,
      });
      feedbackRepliesService.findByFeedbackId.mockResolvedValue({
        id: 'r1',
      });
      const updated = feedbackRow({
        feedbackStatusId: 'st-ans',
        feedbackStatus: {
          id: 'st-ans',
          status: FeedbackStatusesEnum.ANSWERED,
        },
      });
      prisma.feedback.update.mockResolvedValue(updated);

      const out = await service.update('f1', {
        feedbackStatusId: 'st-ans',
      } as UpdateFeedbackRequestDto);

      expect(out.feedbackStatus.status).toBe(FeedbackStatusesEnum.ANSWERED);
    });
  });

  describe('remove', () => {
    it('deletes after findOne', async () => {
      prisma.feedback.findUnique.mockResolvedValue(feedbackRow());
      prisma.feedback.delete.mockResolvedValue(feedbackRow());

      await service.remove('f1');

      expect(prisma.feedback.delete).toHaveBeenCalledWith({
        where: { id: 'f1' },
      });
    });
  });
});
