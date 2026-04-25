import { Test, TestingModule } from '@nestjs/testing';
import { SocialMedia } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { SocialMediaService } from './social-media.service';

describe('SocialMediaService', () => {
  let service: SocialMediaService;
  let prisma: {
    socialMedia: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      socialMedia: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialMediaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SocialMediaService);
  });

  const row: SocialMedia = {
    id: 'sm1',
    name: 'VK',
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.socialMedia.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findById', () => {
    it('throws when missing', async () => {
      prisma.socialMedia.findUnique.mockResolvedValue(null);

      await expect(service.findById('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns record', async () => {
      prisma.socialMedia.findUnique.mockResolvedValue(row);

      const out = await service.findById('sm1');

      expect(out).toEqual(row);
    });
  });
});
