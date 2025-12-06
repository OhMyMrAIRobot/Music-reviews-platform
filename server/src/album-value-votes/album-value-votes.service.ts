import { BadRequestException, Injectable } from '@nestjs/common';
import { AlbumValueVote } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseTypesEnum } from 'src/release-types/types/release-types.enum';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { toDecimal } from 'src/shared/utils/to-decimal';
import { UsersService } from 'src/users/users.service';
import { CreateAlbumVoteRequestDto } from './dto/request/create-album-vote.request.dto';
import { UpdateAlbumVoteRequestDto } from './dto/request/update-album-vote.request.dto';
import { AlbumValueVoteResponseDto } from './dto/respone/album-value-vote.response.dto';

@Injectable()
export class AlbumValueVotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  /**
   * Create a new album value vote for a user.
   *
   * Preconditions:
   * - The referenced release must exist and be of type ALBUM.
   * - The user must exist.
   * - The user must not already have a vote for the same release.
   *
   * The method converts certain numeric inputs to decimal-backed values
   * before persisting and returns the created entity serialized to
   * `AlbumValueVoteResponseDto`.
   */
  async create(
    userId: string,
    dto: CreateAlbumVoteRequestDto,
  ): Promise<AlbumValueVoteResponseDto> {
    const { releaseId } = dto;
    const release = await this.releasesService.findOne(releaseId);
    await this.usersService.findOne(userId);

    if (
      (release.releaseType.type as ReleaseTypesEnum) !== ReleaseTypesEnum.ALBUM
    ) {
      throw new BadRequestException(
        `Оценка ценности альбома может быть расчитана только для релизов с типом ${ReleaseTypesEnum.ALBUM}!`,
      );
    }

    const exist = await this.findByUserReleaseIds(userId, releaseId);

    if (exist) {
      throw new BadRequestException(
        'Вы уже оставляли оценку ценности для данного альбома!',
      );
    }

    const created = await this.prisma.albumValueVote.create({
      data: {
        userId,
        releaseId,
        rarityGenre: toDecimal(dto.rarityGenre),
        rarityPerformance: toDecimal(dto.rarityPerformance),

        formatReleaseScore: dto.formatReleaseScore,
        integrityGenre: toDecimal(dto.integrityGenre),
        integritySemantic: toDecimal(dto.integritySemantic),

        depthScore: dto.depthScore,

        qualityRhymesImages: dto.qualityRhymesImages,
        qualityStructureRhythm: dto.qualityStructureRhythm,
        qualityStyleImpl: dto.qualityStyleImpl,
        qualityIndividuality: dto.qualityIndividuality,

        influenceAuthorPopularity: toDecimal(dto.influenceAuthorPopularity),
        influenceReleaseAnticip: toDecimal(dto.influenceReleaseAnticip),
      },
    });

    return plainToInstance(
      AlbumValueVoteResponseDto,
      JSON.parse(JSON.stringify(created)),
      { excludeExtraneousValues: true },
    );
  }

  /**
   * Get the authenticated user's album value vote for a release.
   *
   * Throws an `EntityNotFoundException` when no vote exists for the
   * provided `userId` and `releaseId` pair.
   */
  async findUserAlbumValueVote(
    userId: string,
    releaseId: string,
  ): Promise<AlbumValueVoteResponseDto> {
    const exist = await this.prisma.albumValueVote.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });

    if (!exist) {
      throw new EntityNotFoundException(
        'Ценность альбома',
        'userId_ReleaseId',
        `${userId}_${releaseId}`,
      );
    }

    return plainToInstance(
      AlbumValueVoteResponseDto,
      JSON.parse(JSON.stringify(exist)),
      { excludeExtraneousValues: true },
    );
  }

  /**
   * Retrieve the raw AlbumValueVote by id.
   *
   * Throws `EntityNotFoundException` if the vote does not exist.
   */
  async findOne(id: string): Promise<AlbumValueVote> {
    const exist = await this.prisma.albumValueVote.findUnique({
      where: { id },
    });

    if (!exist) {
      throw new EntityNotFoundException('Оценка ценности альбома', 'id', id);
    }

    return exist;
  }

  /**
   * Update an existing album value vote.
   *
   * Preconditions:
   * - The authenticated user (provided as `userId`) must own the vote.
   * - At least one field must be provided in the partial DTO.
   *
   * Returns the updated vote serialized to `AlbumValueVoteResponseDto`.
   */
  async update(
    id: string,
    dto: UpdateAlbumVoteRequestDto,
    userId: string,
  ): Promise<AlbumValueVoteResponseDto> {
    await this.checkBelongsToUser(id, userId);

    if (!dto || Object.keys(dto).length === 0) {
      throw new NoDataProvidedException();
    }

    const updated = await this.prisma.albumValueVote.update({
      where: { id },
      data: {
        rarityGenre: dto.rarityGenre ? toDecimal(dto.rarityGenre) : undefined,
        rarityPerformance: dto.rarityPerformance
          ? toDecimal(dto.rarityPerformance)
          : undefined,

        formatReleaseScore: dto.formatReleaseScore,
        integrityGenre: dto.integrityGenre
          ? toDecimal(dto.integrityGenre)
          : undefined,
        integritySemantic: dto.integritySemantic
          ? toDecimal(dto.integritySemantic)
          : undefined,

        depthScore: dto.depthScore,

        qualityRhymesImages: dto.qualityRhymesImages,
        qualityStructureRhythm: dto.qualityStructureRhythm,
        qualityStyleImpl: dto.qualityStyleImpl,
        qualityIndividuality: dto.qualityIndividuality,

        influenceAuthorPopularity: dto.influenceAuthorPopularity
          ? toDecimal(dto.influenceAuthorPopularity)
          : undefined,
        influenceReleaseAnticip: dto.influenceReleaseAnticip
          ? toDecimal(dto.influenceReleaseAnticip)
          : undefined,
      },
    });

    return plainToInstance(
      AlbumValueVoteResponseDto,
      JSON.parse(JSON.stringify(updated)),
      { excludeExtraneousValues: true },
    );
  }

  /**
   * Delete a vote by id. The authenticated user must be the vote owner.
   *
   * Returns the Prisma deleteMany result for convenience.
   */
  async delete(id: string, userId: string) {
    await this.checkBelongsToUser(id, userId);

    await this.prisma.albumValueVote.deleteMany({
      where: { id },
    });

    return;
  }

  private async findByUserReleaseIds(
    userId: string,
    releaseId: string,
  ): Promise<AlbumValueVote | null> {
    return this.prisma.albumValueVote.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  private async checkBelongsToUser(
    voteId: string,
    userId: string,
  ): Promise<AlbumValueVote> {
    const exist = await this.findOne(voteId);

    if (exist.userId !== userId) {
      throw new InsufficientPermissionsException();
    }

    return exist;
  }
}
