import { Test, TestingModule } from '@nestjs/testing';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { PrismaService } from '../../prisma/prisma.service';
import { AlbumValuesService } from './album-values.service';
import { AlbumValuesQueryDto } from './dto/request/query/album-values.query.dto';
import { AlbumValueDto } from './dto/response/album-value.dto';

function mockAlbumValueDto(releaseId: string): AlbumValueDto {
  return {
    rarity: { total: 1, rarityGenre: 1, rarityPerformance: 1 },
    integrity: {
      total: 1,
      formatRelease: 1,
      integrityGenre: 1,
      integritySemantic: 1,
    },
    depth: 1,
    quality: {
      total: 1,
      factor: 1,
      rhymes: 1,
      structure: 1,
      individuality: 1,
      styleImplementation: 1,
    },
    influence: {
      total: 1,
      multiplier: 1,
      releaseAnticip: 1,
      authorPopularity: 1,
    },
    totalValue: 5,
    release: {
      id: releaseId,
      img: '',
      title: 'Album',
      authors: [],
    },
  };
}

describe('AlbumValuesService', () => {
  let service: AlbumValuesService;
  let prisma: { $queryRaw: jest.Mock };
  let releasesService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };
    releasesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumValuesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ReleasesService, useValue: releasesService },
      ],
    }).compile();

    service = module.get(AlbumValuesService);
  });

  describe('findOne', () => {
    it('delegates to releasesService.findOne', async () => {
      releasesService.findOne.mockRejectedValue(
        new EntityNotFoundException('Релиз', 'id', 'x'),
      );
      await expect(service.findOne('x')).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(releasesService.findOne).toHaveBeenCalledWith('x');
    });

    it('throws EntityNotFoundException when aggregate missing', async () => {
      releasesService.findOne.mockResolvedValue({ id: 'r1' });
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [], meta: { count: 0 } } },
      ]);
      await expect(service.findOne('r1')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns first item when present', async () => {
      releasesService.findOne.mockResolvedValue({ id: 'r1' });
      const dto = mockAlbumValueDto('r1');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [dto], meta: { count: 1 } } },
      ]);
      await expect(service.findOne('r1')).resolves.toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('returns result from raw query', async () => {
      const dto = mockAlbumValueDto('r1');
      const payload = { items: [dto], meta: { count: 1 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = Object.assign(new AlbumValuesQueryDto(), {
        sortOrder: 'desc' as const,
        limit: 10,
        offset: 0,
      });
      await expect(service.findAll(query)).resolves.toEqual(payload);
    });
  });
});
