import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from 'src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { AuthorConfirmationsService } from './author-confirmations.service';
import { CreateAuthorConfirmationDto } from './dto/create-author-confirmation.dto';
import { UpdateAuthorConfirmationRequestDto } from './dto/request/update-author-confirmation.request.dto';
import { AuthorConfirmationDto } from './dto/response/author-confirmation.dto';

function confirmationRowWithRelations(overrides: Record<string, unknown> = {}) {
  return {
    id: 'c1',
    userId: 'u1',
    authorId: 'a1',
    statusId: 'st1',
    confirmation: 'proof',
    createdAt: new Date('2020-01-01'),
    user: {
      id: 'u1',
      nickname: 'nick',
      profile: { avatar: 'av.png' },
    },
    author: { id: 'a1', name: 'Author', avatarImg: 'img.png' },
    status: { id: 'st1', status: AuthorConfirmationStatusesEnum.PENDING },
    ...overrides,
  };
}

describe('AuthorConfirmationsService', () => {
  let service: AuthorConfirmationsService;
  let prisma: {
    authorConfirmation: {
      createMany: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let usersService: object;
  let authorConfirmationStatusesService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      authorConfirmation: {
        createMany: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    usersService = {};
    authorConfirmationStatusesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorConfirmationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        {
          provide: AuthorConfirmationStatusesService,
          useValue: authorConfirmationStatusesService,
        },
      ],
    }).compile();

    service = module.get(AuthorConfirmationsService);
  });

  describe('create', () => {
    it('calls createMany with skipDuplicates', async () => {
      const data: CreateAuthorConfirmationDto[] = [
        {
          userId: 'u1',
          authorId: 'a1',
          confirmation: 'x',
          statusId: 'st1',
        },
      ];
      prisma.authorConfirmation.createMany.mockResolvedValue({ count: 1 });

      const out = await service.create(data);

      expect(out).toEqual({ count: 1 });
      expect(prisma.authorConfirmation.createMany).toHaveBeenCalledWith({
        data,
        skipDuplicates: true,
      });
    });
  });

  describe('findAll', () => {
    it('validates statusId when provided', async () => {
      authorConfirmationStatusesService.findOne.mockResolvedValue({
        id: 'st1',
        status: AuthorConfirmationStatusesEnum.PENDING,
      });
      prisma.authorConfirmation.count.mockResolvedValue(0);
      prisma.authorConfirmation.findMany.mockResolvedValue([]);

      await service.findAll({ statusId: 'st1', offset: 0 });

      expect(authorConfirmationStatusesService.findOne).toHaveBeenCalledWith(
        'st1',
      );
    });

    it('skips status lookup when statusId omitted', async () => {
      prisma.authorConfirmation.count.mockResolvedValue(0);
      prisma.authorConfirmation.findMany.mockResolvedValue([]);

      await service.findAll({ offset: 0 });

      expect(authorConfirmationStatusesService.findOne).not.toHaveBeenCalled();
    });

    it('returns meta and mapped items', async () => {
      const row = confirmationRowWithRelations();
      prisma.authorConfirmation.count.mockResolvedValue(1);
      prisma.authorConfirmation.findMany.mockResolvedValue([row]);

      const out = await service.findAll({
        limit: 10,
        offset: 0,
        order: 'desc',
      });

      expect(out.meta.count).toBe(1);
      expect(out.items).toHaveLength(1);
      expect(out.items[0]).toBeInstanceOf(AuthorConfirmationDto);
      expect(out.items[0].id).toBe('c1');
    });
  });

  describe('update', () => {
    it('throws when confirmation missing', async () => {
      prisma.authorConfirmation.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing', {
          statusId: 'st2',
        } as UpdateAuthorConfirmationRequestDto),
      ).rejects.toBeInstanceOf(EntityNotFoundException);
    });

    it('creates registeredAuthor when new status is APPROVED', async () => {
      const exist = confirmationRowWithRelations();
      prisma.authorConfirmation.findUnique.mockResolvedValue(exist);
      authorConfirmationStatusesService.findOne.mockResolvedValue({
        id: 'st-approved',
        status: AuthorConfirmationStatusesEnum.APPROVED,
      });
      const updated = confirmationRowWithRelations({
        statusId: 'st-approved',
        status: {
          id: 'st-approved',
          status: AuthorConfirmationStatusesEnum.APPROVED,
        },
      });
      const regCreate = jest.fn().mockResolvedValue({});
      const acUpdate = jest.fn().mockResolvedValue(updated);
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            registeredAuthor: {
              create: regCreate,
              deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            },
            authorConfirmation: { update: acUpdate },
          }),
      );

      const out = await service.update('c1', {
        statusId: 'st-approved',
      } as UpdateAuthorConfirmationRequestDto);

      expect(regCreate).toHaveBeenCalledWith({
        data: { authorId: 'a1', userId: 'u1' },
      });
      expect(acUpdate).toHaveBeenCalled();
      expect(out).toBeInstanceOf(AuthorConfirmationDto);
      expect(out.id).toBe('c1');
    });

    it('deletes registeredAuthor when new status is REJECTED', async () => {
      const exist = confirmationRowWithRelations();
      prisma.authorConfirmation.findUnique.mockResolvedValue(exist);
      authorConfirmationStatusesService.findOne.mockResolvedValue({
        id: 'st-rej',
        status: AuthorConfirmationStatusesEnum.REJECTED,
      });
      const updated = confirmationRowWithRelations({
        statusId: 'st-rej',
        status: {
          id: 'st-rej',
          status: AuthorConfirmationStatusesEnum.REJECTED,
        },
      });
      const regDeleteMany = jest.fn().mockResolvedValue({ count: 1 });
      const acUpdate = jest.fn().mockResolvedValue(updated);
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            registeredAuthor: {
              create: jest.fn(),
              deleteMany: regDeleteMany,
            },
            authorConfirmation: { update: acUpdate },
          }),
      );

      await service.update('c1', {
        statusId: 'st-rej',
      } as UpdateAuthorConfirmationRequestDto);

      expect(regDeleteMany).toHaveBeenCalledWith({
        where: { authorId: 'a1', userId: 'u1' },
      });
    });
  });

  describe('delete', () => {
    it('throws when confirmation missing', async () => {
      prisma.authorConfirmation.findUnique.mockResolvedValue(null);

      await expect(service.delete('missing')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('removes registeredAuthor and confirmation in transaction', async () => {
      const exist = confirmationRowWithRelations();
      prisma.authorConfirmation.findUnique.mockResolvedValue(exist);
      const regDeleteMany = jest.fn().mockResolvedValue({ count: 0 });
      const acDelete = jest.fn().mockResolvedValue(exist);
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) =>
          fn({
            registeredAuthor: {
              create: jest.fn(),
              deleteMany: regDeleteMany,
            },
            authorConfirmation: { delete: acDelete },
          }),
      );

      await service.delete('c1');

      expect(regDeleteMany).toHaveBeenCalledWith({
        where: { authorId: 'a1', userId: 'u1' },
      });
      expect(acDelete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });
  });
});
