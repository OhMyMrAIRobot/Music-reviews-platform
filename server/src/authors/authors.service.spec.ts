import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorTypesService } from 'src/author-types/author-types.service';
import { FileService } from 'src/file/files.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../shared/exceptions/no-data.exception';
import { AuthorsService } from './authors.service';
import { CreateAuthorRequestDto } from './dto/request/create-author.request.dto';
import { AuthorsQueryDto } from './dto/request/query/authors.query.dto';
import { UpdateAuthorRequestDto } from './dto/request/update-author.request.dto';
import { AuthorDto } from './dto/response/author.dto';

const mockAuthorDto = (id: string, name: string): AuthorDto => ({
  id,
  name,
  avatar: '',
  cover: '',
  isRegistered: false,
  authorTypes: [],
  userFavAuthor: [],
  nominations: {
    winsCount: 0,
    totalCount: 0,
    participations: [],
  },
  releaseTypeRatings: [],
});

describe('AuthorsService', () => {
  let service: AuthorsService;
  let prisma: {
    author: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
    authorOnType: { deleteMany: jest.Mock };
    $transaction: jest.Mock;
    $queryRaw: jest.Mock;
  };
  let authorTypesService: {
    checkTypesExist: jest.Mock;
    findOne: jest.Mock;
  };
  let fileService: { saveFile: jest.Mock; deleteFile: jest.Mock };
  let usersService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      author: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      authorOnType: { deleteMany: jest.fn() },
      $transaction: jest.fn(),
      $queryRaw: jest.fn(),
    };
    authorTypesService = {
      checkTypesExist: jest.fn(),
      findOne: jest.fn(),
    };
    fileService = {
      saveFile: jest.fn(),
      deleteFile: jest.fn(),
    };
    usersService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuthorTypesService, useValue: authorTypesService },
        { provide: FileService, useValue: fileService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(AuthorsService);
  });

  describe('findOne', () => {
    it('throws EntityNotFoundException when missing', async () => {
      prisma.author.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns author row when found', async () => {
      const row = {
        id: 'a1',
        name: 'N',
        avatarImg: '',
        coverImg: '',
      };
      prisma.author.findUnique.mockResolvedValue(row);
      await expect(service.findOne('a1')).resolves.toEqual(row);
    });
  });

  describe('findById', () => {
    it('throws when raw query returns no items', async () => {
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [], meta: { count: 0 } } },
      ]);
      await expect(service.findById('a1')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns first item when found', async () => {
      const dto = mockAuthorDto('a1', 'Name');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [dto], meta: { count: 1 } } },
      ]);
      await expect(service.findById('a1')).resolves.toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('validates typeId and returns result', async () => {
      authorTypesService.findOne.mockResolvedValue({ id: 't1' });
      const payload = {
        items: [mockAuthorDto('a1', 'A')],
        meta: { count: 1 },
      };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = Object.assign(new AuthorsQueryDto(), {
        typeId: 't1',
        limit: 10,
        offset: 0,
      });
      await expect(service.findAll(query)).resolves.toEqual(payload);
      expect(authorTypesService.findOne).toHaveBeenCalledWith('t1');
    });

    it('validates userId when set', async () => {
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      const payload = { items: [], meta: { count: 0 } };
      prisma.$queryRaw.mockResolvedValue([{ result: payload }]);
      const query = Object.assign(new AuthorsQueryDto(), {
        userId: 'u1',
      });
      await expect(service.findAll(query)).resolves.toEqual(payload);
      expect(usersService.findOne).toHaveBeenCalledWith('u1');
    });
  });

  describe('create', () => {
    const dto = Object.assign(new CreateAuthorRequestDto(), {
      name: 'New Author',
      types: ['t1'],
    });

    it('throws BadRequestException when types invalid', async () => {
      authorTypesService.checkTypesExist.mockResolvedValue(false);
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('throws DuplicateFieldException when name taken', async () => {
      authorTypesService.checkTypesExist.mockResolvedValue(true);
      prisma.author.findFirst.mockResolvedValue({
        id: 'existing',
        name: 'Taken',
      });
      const dupDto = Object.assign(new CreateAuthorRequestDto(), {
        name: 'taken',
        types: ['t1'],
      });
      await expect(service.create(dupDto)).rejects.toThrow(
        DuplicateFieldException,
      );
    });

    it('creates author and returns findById result', async () => {
      authorTypesService.checkTypesExist.mockResolvedValue(true);
      prisma.author.findFirst.mockResolvedValue(null);
      prisma.author.create.mockResolvedValue({ id: 'new-id' });
      const out = mockAuthorDto('new-id', 'New Author');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [out], meta: { count: 1 } } },
      ]);
      const result = await service.create(dto);
      expect(result).toEqual(out);
      expect(prisma.author.create).toHaveBeenCalled();
    });

    it('throws InternalServerErrorException and cleans files on failure', async () => {
      authorTypesService.checkTypesExist.mockResolvedValue(true);
      prisma.author.findFirst.mockResolvedValue(null);
      fileService.saveFile.mockResolvedValue('saved.png');
      prisma.author.create.mockRejectedValue(new Error('db'));
      await expect(
        service.create(dto, { filename: 'a' } as Express.Multer.File),
      ).rejects.toThrow(InternalServerErrorException);
      expect(fileService.deleteFile).toHaveBeenCalledWith(
        'authors/avatars/saved.png',
      );
    });
  });

  describe('update', () => {
    it('throws NoDataProvidedException when empty', async () => {
      await expect(
        service.update('a1', {} as UpdateAuthorRequestDto),
      ).rejects.toThrow(NoDataProvidedException);
    });

    it('throws BadRequestException when types invalid', async () => {
      prisma.author.findUnique.mockResolvedValue({
        id: 'a1',
        name: 'N',
        avatarImg: '',
        coverImg: '',
      });
      authorTypesService.checkTypesExist.mockResolvedValue(false);
      const dto = Object.assign(new UpdateAuthorRequestDto(), {
        types: ['bad'],
      });
      await expect(service.update('a1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws DuplicateFieldException when name taken', async () => {
      prisma.author.findUnique.mockResolvedValue({
        id: 'a1',
        name: 'N',
        avatarImg: '',
        coverImg: '',
      });
      prisma.author.findFirst.mockResolvedValue({
        id: 'other',
        name: 'Other',
      });
      const dto = Object.assign(new UpdateAuthorRequestDto(), {
        name: 'Other',
      });
      await expect(service.update('a1', dto)).rejects.toThrow(
        DuplicateFieldException,
      );
    });

    it('updates and returns findById', async () => {
      prisma.author.findUnique.mockResolvedValue({
        id: 'a1',
        name: 'N',
        avatarImg: '',
        coverImg: '',
      });
      prisma.author.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            authorOnType: {
              deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            },
            author: {
              update: jest.fn().mockResolvedValue({ id: 'a1' }),
            },
          }),
      );
      const updated = mockAuthorDto('a1', 'Renamed');
      prisma.$queryRaw.mockResolvedValue([
        { result: { items: [updated], meta: { count: 1 } } },
      ]);
      const dto = Object.assign(new UpdateAuthorRequestDto(), {
        name: 'Renamed',
      });
      const result = await service.update('a1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deletes and removes files when present', async () => {
      prisma.author.findUnique.mockResolvedValue({
        id: 'a1',
        name: 'N',
        avatarImg: '',
        coverImg: '',
      });
      prisma.author.delete.mockResolvedValue({
        id: 'a1',
        avatarImg: 'av.png',
        coverImg: 'cv.png',
      });
      await service.remove('a1');
      expect(fileService.deleteFile).toHaveBeenCalledWith(
        'authors/avatars/av.png',
      );
      expect(fileService.deleteFile).toHaveBeenCalledWith(
        'authors/covers/cv.png',
      );
    });
  });

  describe('checkAuthorsExist', () => {
    it('returns true for empty ids', async () => {
      await expect(service.checkAuthorsExist([])).resolves.toBe(true);
      expect(prisma.author.findMany).not.toHaveBeenCalled();
    });

    it('returns true when all exist', async () => {
      prisma.author.findMany.mockResolvedValue([{ id: 'a1' }, { id: 'a2' }]);
      await expect(service.checkAuthorsExist(['a1', 'a2'])).resolves.toBe(true);
    });

    it('returns false when count mismatches', async () => {
      prisma.author.findMany.mockResolvedValue([{ id: 'a1' }]);
      await expect(service.checkAuthorsExist(['a1', 'a2'])).resolves.toBe(
        false,
      );
    });
  });
});
