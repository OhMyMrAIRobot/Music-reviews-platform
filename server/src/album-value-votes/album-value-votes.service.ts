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

  async findByUserReleaseIds(
    userId: string,
    releaseId: string,
  ): Promise<AlbumValueVote | null> {
    return this.prisma.albumValueVote.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  async findOne(id: string): Promise<AlbumValueVote> {
    const exist = await this.prisma.albumValueVote.findUnique({
      where: { id },
    });

    if (!exist) {
      throw new EntityNotFoundException('Оценка ценности альбома', 'id', id);
    }

    return exist;
  }

  async update(
    id: string,
    dto: UpdateAlbumVoteRequestDto,
    userId: string,
  ): Promise<AlbumValueVoteResponseDto> {
    await this.checkBelongsToUser(id, userId);

    if (!dto || Object.keys(dto).length === 0) {
      throw new NoDataProvidedException();
    }

    console.log(dto);
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
