import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from 'src/authors/authors.service';
import { FileService } from 'src/file/files.service';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { ReleaseTypesEnum } from 'src/release-types/types/release-types.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../shared/exceptions/no-data.exception';
import { CreateReleaseRequestDto } from './dto/request/create-release.request.dto';
import { ReleasesQueryDto } from './dto/request/query/releases.query.dto';
import { UpdateReleaseRequestDto } from './dto/request/update-release.request.dto';
import { ReleaseDto } from './dto/response/release.dto';
import { ReleasesService } from './releases.service';

function mockReleaseEntity(id: string) {
  return {
    id,
    title: 'T',
    publishDate: new Date(),
    img: '',
    releaseTypeId: 'rt1',
    createdAt: new Date(),
    youtubeId: null as string | null,
    releaseArtist: [],
    releaseDesigner: [],
    releaseProducer: [],
    releaseType: { id: 'rt1', type: ReleaseTypesEnum.ALBUM },
  };
}

function mockReleaseDto(id: string, title: string): ReleaseDto {
  return {
    id,
    title,
    img: '',
    youtubeId: null,
    releaseType: { id: 'rt1', type: ReleaseTypesEnum.ALBUM },
    publishDate: '2020-01-01T00:00:00.000Z',
    createdAt: '2020-01-01T00:00:00.000Z',
    authors: { artists: [], designers: [], producers: [] },
    userFavRelease: [],
    ratings: { total: [], details: [] },
    reviewsInfo: { withText: 0, withoutText: 0 },
    nominationTypes: [],
    hasAuthorLikes: false,
    hasAuthorComments: false,
    hasLyrics: false,
  };
}

function mockListMeta() {
  return {
    count: 1,
    minPublishYear: 2020,
    maxPublishYear: 2020,
  };
}

describe('ReleasesService', () => {
  let service: ReleasesService;
  let prisma: {
    release: {
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
    $queryRaw: jest.Mock;
  };
  let releaseTypesService: { findOne: jest.Mock };
  let authorsService: {
    checkAuthorsExist: jest.Mock;
    findOne: jest.Mock;
  };
  let fileService: { saveFile: jest.Mock; deleteFile: jest.Mock };

  beforeEach(async () => {
    prisma = {
      release: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
      $queryRaw: jest.fn(),
    };
    releaseTypesService = { findOne: jest.fn() };
    authorsService = {
      checkAuthorsExist: jest.fn(),
      findOne: jest.fn(),
    };
    fileService = { saveFile: jest.fn(), deleteFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleasesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ReleaseTypesService, useValue: releaseTypesService },
        { provide: AuthorsService, useValue: authorsService },
        { provide: FileService, useValue: fileService },
      ],
    }).compile();

    service = module.get(ReleasesService);
  });

  describe('findOne', () => {
    it('throws EntityNotFoundException when missing', async () => {
      prisma.release.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns release when found', async () => {
      const row = mockReleaseEntity('r1');
      prisma.release.findUnique.mockResolvedValue(row);
      await expect(service.findOne('r1')).resolves.toEqual(row);
    });
  });

  describe('findById', () => {
    it('throws when items empty', async () => {
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('r1'));
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [], meta: mockListMeta() } },
      ]);
      await expect(service.findById('r1')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns dto when found', async () => {
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('r1'));
      const dto = mockReleaseDto('r1', 'Title');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [dto], meta: mockListMeta() } },
      ]);
      await expect(service.findById('r1')).resolves.toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('returns result from raw query', async () => {
      const payload = {
        items: [mockReleaseDto('r1', 'A')],
        meta: mockListMeta(),
      };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = new ReleasesQueryDto();
      await expect(service.findAll(query)).resolves.toEqual(payload);
    });

    it('validates authorId when set', async () => {
      authorsService.findOne.mockResolvedValue({ id: 'a1' });
      const payload = { items: [], meta: mockListMeta() };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = Object.assign(new ReleasesQueryDto(), { authorId: 'a1' });
      await expect(service.findAll(query)).resolves.toEqual(payload);
      expect(authorsService.findOne).toHaveBeenCalledWith('a1');
    });

    it('validates typeId when set', async () => {
      releaseTypesService.findOne.mockResolvedValue({ id: 't1' });
      const payload = { items: [], meta: mockListMeta() };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = Object.assign(new ReleasesQueryDto(), { typeId: 't1' });
      await expect(service.findAll(query)).resolves.toEqual(payload);
      expect(releaseTypesService.findOne).toHaveBeenCalledWith('t1');
    });
  });

  describe('create', () => {
    const dto = Object.assign(new CreateReleaseRequestDto(), {
      title: 'Album',
      publishDate: new Date('2020-01-01'),
      releaseTypeId: 'rt1',
      releaseArtists: ['a1'],
    });

    it('throws BadRequestException when authors missing', async () => {
      releaseTypesService.findOne.mockResolvedValue({ id: 'rt1' });
      authorsService.checkAuthorsExist.mockResolvedValue(false);
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('creates release and returns findById', async () => {
      releaseTypesService.findOne.mockResolvedValue({ id: 'rt1' });
      authorsService.checkAuthorsExist.mockResolvedValue(true);
      prisma.release.create.mockResolvedValue({ id: 'new-r' });
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('new-r'));
      const out = mockReleaseDto('new-r', 'Album');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [out], meta: mockListMeta() } },
      ]);
      const result = await service.create(dto);
      expect(result).toEqual(out);
      expect(prisma.release.create).toHaveBeenCalled();
    });

    it('throws InternalServerErrorException and deletes cover on failure', async () => {
      releaseTypesService.findOne.mockResolvedValue({ id: 'rt1' });
      authorsService.checkAuthorsExist.mockResolvedValue(true);
      fileService.saveFile.mockResolvedValue('cov.png');
      prisma.release.create.mockRejectedValue(new Error('db'));
      await expect(
        service.create(dto, { filename: 'f' } as Express.Multer.File),
      ).rejects.toThrow(InternalServerErrorException);
      expect(fileService.deleteFile).toHaveBeenCalledWith('cov.png');
    });
  });

  describe('update', () => {
    it('throws NoDataProvidedException when empty', async () => {
      await expect(
        service.update('r1', {} as UpdateReleaseRequestDto),
      ).rejects.toThrow(NoDataProvidedException);
    });

    it('throws BadRequestException when authors invalid', async () => {
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('r1'));
      authorsService.checkAuthorsExist.mockResolvedValue(false);
      const dto = Object.assign(new UpdateReleaseRequestDto(), {
        releaseArtists: ['bad'],
      });
      await expect(service.update('r1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('updates and returns findById', async () => {
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('r1'));
      authorsService.checkAuthorsExist.mockResolvedValue(true);
      releaseTypesService.findOne.mockResolvedValue({ id: 'rt2' });
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            releaseArtist: { deleteMany: jest.fn().mockResolvedValue({}) },
            releaseProducer: { deleteMany: jest.fn().mockResolvedValue({}) },
            releaseDesigner: { deleteMany: jest.fn().mockResolvedValue({}) },
            release: {
              update: jest.fn().mockResolvedValue({ id: 'r1' }),
            },
          }),
      );
      const updated = mockReleaseDto('r1', 'Renamed');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [updated], meta: mockListMeta() } },
      ]);
      const dto = Object.assign(new UpdateReleaseRequestDto(), {
        title: 'Renamed',
        releaseTypeId: 'rt2',
      });
      const result = await service.update('r1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deletes and removes cover when set', async () => {
      prisma.release.findUnique.mockResolvedValue(mockReleaseEntity('r1'));
      prisma.release.delete.mockResolvedValue({
        id: 'r1',
        img: 'pic.png',
      });
      await service.remove('r1');
      expect(fileService.deleteFile).toHaveBeenCalledWith('releases/pic.png');
    });
  });
});
