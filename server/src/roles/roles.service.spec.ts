import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { RolesService } from './roles.service';
import { UserRoleEnum } from './types/user-role.enum';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: {
    role: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      role: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(RolesService);
  });

  const row: Role = {
    id: 'r1',
    role: UserRoleEnum.ADMIN,
  };

  describe('findAll', () => {
    it('returns all rows', async () => {
      prisma.role.findMany.mockResolvedValue([row]);

      const out = await service.findAll();

      expect(out).toEqual([row]);
    });
  });

  describe('findById', () => {
    it('throws when missing', async () => {
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.findById('x')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns role', async () => {
      prisma.role.findUnique.mockResolvedValue(row);

      const out = await service.findById('r1');

      expect(out).toEqual(row);
    });
  });

  describe('findByName', () => {
    it('throws when missing', async () => {
      prisma.role.findFirst.mockResolvedValue(null);

      await expect(service.findByName('unknown')).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });

    it('returns role', async () => {
      prisma.role.findFirst.mockResolvedValue(row);

      const out = await service.findByName('администратор');

      expect(out).toEqual(row);
      expect(prisma.role.findFirst).toHaveBeenCalledWith({
        where: { role: { equals: 'администратор', mode: 'insensitive' } },
      });
    });
  });

  describe('getValidRole', () => {
    it('returns same enum for known value', () => {
      expect(service.getValidRole(UserRoleEnum.ADMIN)).toBe(UserRoleEnum.ADMIN);
    });

    it('returns USER for unknown string', () => {
      expect(service.getValidRole('not-a-role')).toBe(UserRoleEnum.USER);
    });
  });
});
