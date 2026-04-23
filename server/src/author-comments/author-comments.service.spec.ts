import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorComment } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisteredAuthorsService } from 'src/registered-authors/registered-authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { AuthorCommentsService } from './author-comments.service';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';
import { AuthorCommentDto } from './dto/response/author-comment.dto';

function mockCommentDto(id: string): AuthorCommentDto {
  return {
    id,
    title: 'Title',
    text: 'x'.repeat(300),
    createdAt: new Date().toISOString(),
    user: {
      id: 'u1',
      nickname: 'n',
      avatar: '',
      points: 0,
      rank: null,
    },
    release: { id: 'rel1', title: 'Rel', img: '' },
    author: { type: [], totalComments: 0, totalAuthorLikes: 0 },
  };
}

function rawQueryResult(items: AuthorCommentDto[], count: number) {
  return [{ result: { items, meta: { count } } }];
}

describe('AuthorCommentsService', () => {
  let service: AuthorCommentsService;
  let prisma: {
    authorComment: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $queryRaw: jest.Mock;
  };
  let releasesService: { findOne: jest.Mock };
  let registeredAuthorsService: { checkUserIsReleaseAuthor: jest.Mock };

  beforeEach(async () => {
    prisma = {
      authorComment: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };
    releasesService = { findOne: jest.fn() };
    registeredAuthorsService = { checkUserIsReleaseAuthor: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorCommentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: ReleasesService, useValue: releasesService },
        {
          provide: RegisteredAuthorsService,
          useValue: registeredAuthorsService,
        },
      ],
    }).compile();

    service = module.get(AuthorCommentsService);
  });

  describe('create', () => {
    const dto = {
      title: 'Title',
      text: 'x'.repeat(300),
      releaseId: 'rel1',
    } as CreateAuthorCommentRequestDto;

    it('throws when user already commented on release', async () => {
      registeredAuthorsService.checkUserIsReleaseAuthor.mockResolvedValue(
        undefined,
      );
      prisma.authorComment.findUnique.mockResolvedValue({
        id: 'existing',
      } as AuthorComment);

      await expect(service.create(dto, 'u1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(prisma.authorComment.create).not.toHaveBeenCalled();
    });

    it('creates and returns dto from raw query', async () => {
      registeredAuthorsService.checkUserIsReleaseAuthor.mockResolvedValue(
        undefined,
      );
      prisma.authorComment.findUnique.mockResolvedValue(null);
      prisma.authorComment.create.mockResolvedValue({
        id: 'c-new',
        userId: 'u1',
        releaseId: 'rel1',
        title: dto.title,
        text: dto.text,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const item = mockCommentDto('c-new');
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([item], 1));

      const out = await service.create(dto, 'u1');

      expect(out.id).toBe('c-new');
      expect(prisma.authorComment.create).toHaveBeenCalledWith({
        data: { userId: 'u1', ...dto },
      });
    });
  });

  describe('findById', () => {
    it('throws when raw query returns no items', async () => {
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([], 0));

      await expect(service.findById('missing')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns first item', async () => {
      const item = mockCommentDto('c1');
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([item], 1));

      const out = await service.findById('c1');

      expect(out).toEqual(item);
    });
  });

  describe('findByReleaseId', () => {
    it('throws when release missing', async () => {
      releasesService.findOne.mockRejectedValue(
        new EntityNotFoundException('Релиз', 'id', 'bad'),
      );

      await expect(service.findByReleaseId('bad')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
      expect(prisma.$queryRaw).not.toHaveBeenCalled();
    });

    it('returns list from raw query', async () => {
      releasesService.findOne.mockResolvedValue({ id: 'rel1' });
      const item = mockCommentDto('c1');
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([item], 1));

      const out = await service.findByReleaseId('rel1');

      expect(out.items).toHaveLength(1);
      expect(out.meta.count).toBe(1);
    });
  });

  describe('findAll', () => {
    it('delegates to raw query', async () => {
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([], 0));

      const out = await service.findAll({ limit: 10, offset: 0 });

      expect(out.items).toEqual([]);
      expect(out.meta.count).toBe(0);
    });
  });

  describe('update', () => {
    const row: AuthorComment = {
      id: 'c1',
      userId: 'u1',
      releaseId: 'rel1',
      title: 'Title',
      text: 'x'.repeat(300),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('throws when user is not owner', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);

      await expect(
        service.update(
          'c1',
          { title: 'Newtit' } as UpdateAuthorCommentRequestDto,
          'u2',
        ),
      ).rejects.toBeInstanceOf(InsufficientPermissionsException);
    });

    it('updates and returns refreshed dto', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);
      registeredAuthorsService.checkUserIsReleaseAuthor.mockResolvedValue(
        undefined,
      );
      prisma.authorComment.update.mockResolvedValue({ ...row, id: 'c1' });
      const updated = mockCommentDto('c1');
      updated.title = 'Newtit';
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([updated], 1));

      const out = await service.update(
        'c1',
        { title: 'Newtit' } as UpdateAuthorCommentRequestDto,
        'u1',
      );

      expect(out.title).toBe('Newtit');
      expect(
        registeredAuthorsService.checkUserIsReleaseAuthor,
      ).toHaveBeenCalledWith('u1', 'rel1');
    });

    it('skips ownership checks when userId omitted', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);
      prisma.authorComment.update.mockResolvedValue(row);
      const updated = mockCommentDto('c1');
      prisma.$queryRaw.mockResolvedValue(rawQueryResult([updated], 1));

      await service.update('c1', {
        title: 'Newtit',
      } as UpdateAuthorCommentRequestDto);

      expect(
        registeredAuthorsService.checkUserIsReleaseAuthor,
      ).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const row: AuthorComment = {
      id: 'c1',
      userId: 'u1',
      releaseId: 'rel1',
      title: 'Title',
      text: 'x'.repeat(300),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('throws when user is not owner', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);

      await expect(service.delete('c1', 'u2')).rejects.toBeInstanceOf(
        InsufficientPermissionsException,
      );
      expect(prisma.authorComment.delete).not.toHaveBeenCalled();
    });

    it('deletes when owner', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);
      registeredAuthorsService.checkUserIsReleaseAuthor.mockResolvedValue(
        undefined,
      );
      prisma.authorComment.delete.mockResolvedValue(row);

      await service.delete('c1', 'u1');

      expect(prisma.authorComment.delete).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });

    it('deletes without ownership when userId omitted', async () => {
      prisma.authorComment.findUnique.mockResolvedValue(row);
      prisma.authorComment.delete.mockResolvedValue(row);

      await service.delete('c1');

      expect(
        registeredAuthorsService.checkUserIsReleaseAuthor,
      ).not.toHaveBeenCalled();
      expect(prisma.authorComment.delete).toHaveBeenCalled();
    });
  });
});
