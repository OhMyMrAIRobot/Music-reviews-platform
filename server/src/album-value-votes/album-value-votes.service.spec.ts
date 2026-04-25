import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseTypesEnum } from 'src/release-types/types/release-types.enum';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlbumValueVotesService } from './album-value-votes.service';
import { CreateAlbumVoteRequestDto } from './dto/request/create-album-vote.request.dto';
import { UpdateAlbumVoteRequestDto } from './dto/request/update-album-vote.request.dto';

function albumRelease() {
  return {
    id: 'rel1',
    title: 'A',
    releaseType: { type: ReleaseTypesEnum.ALBUM },
  };
}

function trackRelease() {
  return {
    id: 'rel2',
    title: 'T',
    releaseType: { type: ReleaseTypesEnum.SINGLE },
  };
}

function voteRow(id: string, userId: string, releaseId: string) {
  return {
    id,
    userId,
    releaseId,
    rarityGenre: '1.5',
    rarityPerformance: '1.5',
    formatReleaseScore: 1,
    integrityGenre: '1.5',
    integritySemantic: '0.5',
    depthScore: 3,
    qualityRhymesImages: 5,
    qualityStructureRhythm: 5,
    qualityStyleImpl: 5,
    qualityIndividuality: 5,
    influenceAuthorPopularity: '1.5',
    influenceReleaseAnticip: '2.5',
    createdAt: new Date(),
  };
}

function createDto(releaseId: string): CreateAlbumVoteRequestDto {
  return Object.assign(new CreateAlbumVoteRequestDto(), {
    releaseId,
    rarityGenre: 0.5,
    rarityPerformance: 1.5,
    formatReleaseScore: 1,
    integrityGenre: 2.5,
    integritySemantic: 0.5,
    depthScore: 3,
    qualityRhymesImages: 5,
    qualityStructureRhythm: 5,
    qualityStyleImpl: 5,
    qualityIndividuality: 5,
    influenceAuthorPopularity: 1.5,
    influenceReleaseAnticip: 2.5,
  });
}

describe('AlbumValueVotesService', () => {
  let service: AlbumValueVotesService;
  let prisma: {
    albumValueVote: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let usersService: { findOne: jest.Mock };
  let releasesService: { findOne: jest.Mock };

  beforeEach(async () => {
    prisma = {
      albumValueVote: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    usersService = { findOne: jest.fn() };
    releasesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumValueVotesService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: ReleasesService, useValue: releasesService },
      ],
    }).compile();

    service = module.get(AlbumValueVotesService);
  });

  describe('create', () => {
    it('throws BadRequestException when release is not album', async () => {
      releasesService.findOne.mockResolvedValue(trackRelease());
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      await expect(service.create('u1', createDto('rel2'))).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when vote already exists', async () => {
      releasesService.findOne.mockResolvedValue(albumRelease());
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'u1', 'rel1'),
      );
      await expect(service.create('u1', createDto('rel1'))).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates vote', async () => {
      releasesService.findOne.mockResolvedValue(albumRelease());
      usersService.findOne.mockResolvedValue({ id: 'u1' });
      prisma.albumValueVote.findUnique.mockResolvedValue(null);
      const created = voteRow('new', 'u1', 'rel1');
      prisma.albumValueVote.create.mockResolvedValue(created);
      const result = await service.create('u1', createDto('rel1'));
      expect(result.id).toBe('new');
      expect(result.userId).toBe('u1');
      expect(result.releaseId).toBe('rel1');
      expect(prisma.albumValueVote.create).toHaveBeenCalled();
    });
  });

  describe('findUserAlbumValueVote', () => {
    it('throws EntityNotFoundException when missing', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(null);
      await expect(
        service.findUserAlbumValueVote('u1', 'rel1'),
      ).rejects.toThrow(EntityNotFoundException);
    });

    it('returns dto when found', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'u1', 'rel1'),
      );
      const result = await service.findUserAlbumValueVote('u1', 'rel1');
      expect(result.id).toBe('v1');
    });
  });

  describe('findOne', () => {
    it('throws when missing', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('returns row when found', async () => {
      const row = voteRow('v1', 'u1', 'rel1');
      prisma.albumValueVote.findUnique.mockResolvedValue(row);
      await expect(service.findOne('v1')).resolves.toEqual(row);
    });
  });

  describe('update', () => {
    it('throws InsufficientPermissionsException when not owner', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'owner', 'rel1'),
      );
      await expect(
        service.update(
          'v1',
          { depthScore: 4 } as UpdateAlbumVoteRequestDto,
          'other',
        ),
      ).rejects.toThrow(InsufficientPermissionsException);
    });

    it('throws NoDataProvidedException when dto empty', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'u1', 'rel1'),
      );
      await expect(
        service.update('v1', {} as UpdateAlbumVoteRequestDto, 'u1'),
      ).rejects.toThrow(NoDataProvidedException);
    });

    it('updates when owner', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'u1', 'rel1'),
      );
      const updated = { ...voteRow('v1', 'u1', 'rel1'), depthScore: 4 };
      prisma.albumValueVote.update.mockResolvedValue(updated);
      const result = await service.update(
        'v1',
        Object.assign(new UpdateAlbumVoteRequestDto(), { depthScore: 4 }),
        'u1',
      );
      expect(result.depthScore).toBe(4);
    });
  });

  describe('delete', () => {
    it('throws when not owner', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'owner', 'rel1'),
      );
      await expect(service.delete('v1', 'other')).rejects.toThrow(
        InsufficientPermissionsException,
      );
    });

    it('deletes when owner', async () => {
      prisma.albumValueVote.findUnique.mockResolvedValue(
        voteRow('v1', 'u1', 'rel1'),
      );
      prisma.albumValueVote.deleteMany.mockResolvedValue({ count: 1 });
      await expect(service.delete('v1', 'u1')).resolves.toBeUndefined();
      expect(prisma.albumValueVote.deleteMany).toHaveBeenCalledWith({
        where: { id: 'v1' },
      });
    });
  });
});
